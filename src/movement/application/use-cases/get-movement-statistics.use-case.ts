import { Inject, Injectable } from '@nestjs/common';
import { MovementRepository } from '../../domain/repositories/movement.repository';
import { MOVEMENT_REPOSITORY_TOKEN } from '../../domain/repositories/movement.repository.token';

export interface MovementStatistics {
  totalMovements: number;
  averageSpeed: number;
  totalDistance: number;
  movementsByType: Record<string, number>;
  mostActiveHour: number;
  averageMovementsPerDay: number;
  fastestMovement: number;
  slowestMovement: number;
}

export interface EntityPositionInfo {
  entityId: string;
  lastPosition: { x: number; y: number; z: number } | null;
  lastMovementTime: Date | null;
  isOnline: boolean;
}

@Injectable()
export class GetMovementStatisticsUseCase {
  constructor(
    @Inject(MOVEMENT_REPOSITORY_TOKEN)
    private readonly movementRepository: MovementRepository,
  ) {}

  async getEntityStatistics(entityId: string): Promise<MovementStatistics> {
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    const [
      totalMovements,
      averageSpeed,
      totalDistance,
      allMovements
    ] = await Promise.all([
      this.movementRepository.countMovementsByEntity(entityId),
      this.movementRepository.getAverageSpeed(entityId),
      this.movementRepository.getTotalDistance(entityId),
      this.movementRepository.findByEntityId(entityId)
    ]);

    // Calcular estatísticas por tipo
    const movementsByType: Record<string, number> = {};
    const movementHours: number[] = [];
    const speeds: number[] = [];

    allMovements.forEach(movement => {
      const type = movement.getType();
      movementsByType[type] = (movementsByType[type] || 0) + 1;
      
      movementHours.push(movement.getTimestamp().getHours());
      speeds.push(movement.getSpeed());
    });

    // Hora mais ativa
    const hourCounts: Record<number, number> = {};
    movementHours.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const mostActiveHour = Object.entries(hourCounts)
      .reduce((max, [hour, count]) => count > max.count ? { hour: parseInt(hour), count } : max, 
              { hour: 0, count: 0 }).hour;

    // Média de movimentos por dia
    const firstMovement = allMovements[allMovements.length - 1];
    const lastMovement = allMovements[0];
    
    let averageMovementsPerDay = 0;
    if (firstMovement && lastMovement) {
      const daysDiff = Math.max(1, 
        (lastMovement.getTimestamp().getTime() - firstMovement.getTimestamp().getTime()) / (1000 * 60 * 60 * 24)
      );
      averageMovementsPerDay = totalMovements / daysDiff;
    }

    return {
      totalMovements,
      averageSpeed,
      totalDistance,
      movementsByType,
      mostActiveHour,
      averageMovementsPerDay,
      fastestMovement: speeds.length > 0 ? Math.max(...speeds) : 0,
      slowestMovement: speeds.length > 0 ? Math.min(...speeds) : 0,
    };
  }

  async getGlobalStatistics(timeRangeMinutes?: number): Promise<MovementStatistics> {
    let movements;
    
    if (timeRangeMinutes) {
      if (timeRangeMinutes <= 0) {
        throw new Error('Intervalo de tempo deve ser positivo');
      }
      movements = await this.movementRepository.findRecentMovements(timeRangeMinutes);
    } else {
      movements = await this.movementRepository.findAll();
    }

    const totalMovements = movements.length;
    
    if (totalMovements === 0) {
      return {
        totalMovements: 0,
        averageSpeed: 0,
        totalDistance: 0,
        movementsByType: {},
        mostActiveHour: 0,
        averageMovementsPerDay: 0,
        fastestMovement: 0,
        slowestMovement: 0,
      };
    }

    // Calcular estatísticas
    const movementsByType: Record<string, number> = {};
    const movementHours: number[] = [];
    const speeds: number[] = [];
    let totalDistance = 0;

    movements.forEach(movement => {
      const type = movement.getType();
      movementsByType[type] = (movementsByType[type] || 0) + 1;
      
      movementHours.push(movement.getTimestamp().getHours());
      speeds.push(movement.getSpeed());
      totalDistance += movement.getDistance();
    });

    const averageSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;

    // Hora mais ativa
    const hourCounts: Record<number, number> = {};
    movementHours.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const mostActiveHour = Object.entries(hourCounts)
      .reduce((max, [hour, count]) => count > max.count ? { hour: parseInt(hour), count } : max, 
              { hour: 0, count: 0 }).hour;

    // Média de movimentos por dia
    const firstMovement = movements[movements.length - 1];
    const lastMovement = movements[0];
    
    let averageMovementsPerDay = 0;
    if (firstMovement && lastMovement) {
      const daysDiff = Math.max(1, 
        (lastMovement.getTimestamp().getTime() - firstMovement.getTimestamp().getTime()) / (1000 * 60 * 60 * 24)
      );
      averageMovementsPerDay = totalMovements / daysDiff;
    }

    return {
      totalMovements,
      averageSpeed,
      totalDistance,
      movementsByType,
      mostActiveHour,
      averageMovementsPerDay,
      fastestMovement: Math.max(...speeds),
      slowestMovement: Math.min(...speeds),
    };
  }

  async getEntitiesInRange(x: number, y: number, z: number, range: number): Promise<string[]> {
    this.validateCoordinates(x, y, z);
    
    if (range < 0) {
      throw new Error('Alcance não pode ser negativo');
    }

    if (range > 100) {
      throw new Error('Alcance não pode exceder 100');
    }

    return await this.movementRepository.findEntitiesInRange(x, y, z, range);
  }

  async getEntityPositionInfo(entityId: string): Promise<EntityPositionInfo> {
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    const lastMovement = await this.movementRepository.getLastMovement(entityId);
    
    if (!lastMovement) {
      return {
        entityId,
        lastPosition: null,
        lastMovementTime: null,
        isOnline: false,
      };
    }

    const lastPosition = lastMovement.getToPosition();
    const lastMovementTime = lastMovement.getTimestamp();
    
    // Considera online se teve movimento nos últimos 5 minutos
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const isOnline = lastMovementTime > fiveMinutesAgo;

    return {
      entityId,
      lastPosition,
      lastMovementTime,
      isOnline,
    };
  }

  private validateCoordinates(x: number, y: number, z: number): void {
    if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(z)) {
      throw new Error('Coordenadas devem ser números inteiros');
    }

    if (x < 0 || y < 0 || z < 0) {
      throw new Error('Coordenadas não podem ser negativas');
    }

    if (x > 9999 || y > 9999 || z > 15) {
      throw new Error('Coordenadas fora dos limites permitidos');
    }
  }
}
