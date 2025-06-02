import { Inject, Injectable } from '@nestjs/common';
import { MovementRepository } from '../../domain/repositories/movement.repository';
import { MOVEMENT_REPOSITORY_TOKEN } from '../../domain/repositories/movement.repository.token';
import { Movement } from '../../domain/entities/movement.entity';

@Injectable()
export class GetMovementHistoryUseCase {
  constructor(
    @Inject(MOVEMENT_REPOSITORY_TOKEN)
    private readonly movementRepository: MovementRepository,
  ) {}

  async getMovementsByEntity(entityId: string, limit?: number): Promise<Movement[]> {
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    const movements = await this.movementRepository.findByEntityId(entityId);
    
    // Ordenar por timestamp decrescente (mais recente primeiro)
    movements.sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());

    return limit ? movements.slice(0, limit) : movements;
  }

  async getRecentMovements(entityId: string, minutes: number = 5): Promise<Movement[]> {
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    if (minutes <= 0) {
      throw new Error('Quantidade de minutos deve ser positiva');
    }

    return await this.movementRepository.findRecentMovementsByEntity(entityId, minutes);
  }

  async getMovementsInTimeRange(
    startTime: Date, 
    endTime: Date, 
    entityId?: string,
  ): Promise<Movement[]> {
    if (startTime >= endTime) {
      throw new Error('Data de início deve ser anterior à data de fim');
    }

    const movements = await this.movementRepository.findByTimeRange(startTime, endTime);

    if (entityId) {
      return movements.filter(m => m.getEntityId() === entityId);
    }

    return movements;
  }

  async getMovementPath(entityId: string, limit?: number): Promise<Movement[]> {
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    return await this.movementRepository.getMovementPath(entityId, limit);
  }

  async getLastMovement(entityId: string): Promise<Movement | null> {
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    return await this.movementRepository.getLastMovement(entityId);
  }

  async getMovementById(id: string): Promise<Movement> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID do movimento é obrigatório');
    }

    const movement = await this.movementRepository.findById(id);
    if (!movement) {
      throw new Error('Movimento não encontrado');
    }

    return movement;
  }

  async getMovementsToPosition(x: number, y: number, z: number): Promise<Movement[]> {
    this.validateCoordinates(x, y, z);
    return await this.movementRepository.findMovementsToPosition(x, y, z);
  }

  async getMovementsFromPosition(x: number, y: number, z: number): Promise<Movement[]> {
    this.validateCoordinates(x, y, z);
    return await this.movementRepository.findMovementsFromPosition(x, y, z);
  }

  async getMovementsInArea(
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number, 
    z: number
  ): Promise<Movement[]> {
    this.validateCoordinates(startX, startY, z);
    this.validateCoordinates(endX, endY, z);

    if (startX > endX || startY > endY) {
      throw new Error('Coordenadas de início devem ser menores que as de fim');
    }

    return await this.movementRepository.findMovementsInArea(startX, startY, endX, endY, z);
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
