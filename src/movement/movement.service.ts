import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

// Domain entities
import { Movement } from './domain/entities/movement.entity';
import { MovementEvent, MovementEventStatus, MovementEventType } from './domain/entities/movement-event.entity';

// Repository
import { MovementRepository } from './domain/repositories/movement.repository';
import { MOVEMENT_REPOSITORY_TOKEN } from './domain/repositories/movement.repository.token';

// DTOs
import { ExecuteMovementDto } from './dto/execute-movement.dto';
import { 
  MovementResultResponseDto, 
  MovementResponseDto,
  MovementStatisticsResponseDto,
  EntityPositionInfoResponseDto 
} from './dto/movement-response.dto';

// Use Cases
import { ExecuteMovementUseCase } from './application/use-cases/execute-movement.use-case';
import { GetMovementHistoryUseCase } from './application/use-cases/get-movement-history.use-case';
import { GetMovementStatisticsUseCase } from './application/use-cases/get-movement-statistics.use-case';
import { DeleteMovementUseCase } from './application/use-cases/delete-movement.use-case';

// Event-Based Use Cases
import { RequestMovementUseCase } from './application/use-cases/request-movement.use-case';
import { TeleportEntityUseCase } from './application/use-cases/teleport-entity.use-case';
import { CancelMovementUseCase } from './application/use-cases/cancel-movement.use-case';
import { GetMovementStatusUseCase } from './application/use-cases/get-movement-status.use-case';

// Infrastructure Services
import { MovingEntitiesTrackingService } from './infrastructure/services/moving-entities-tracking.service';

@Injectable()
export class MovementService {
  constructor(
    // Repository
    @Inject(MOVEMENT_REPOSITORY_TOKEN)
    private readonly movementRepository: MovementRepository,
    
    // Legacy Use Cases
    private readonly executeMovementUseCase: ExecuteMovementUseCase,
    private readonly getMovementHistoryUseCase: GetMovementHistoryUseCase,
    private readonly getMovementStatisticsUseCase: GetMovementStatisticsUseCase,
    private readonly deleteMovementUseCase: DeleteMovementUseCase,
    
    // Event-Based Use Cases
    private readonly requestMovementUseCase: RequestMovementUseCase,
    private readonly teleportEntityUseCase: TeleportEntityUseCase,
    private readonly cancelMovementUseCase: CancelMovementUseCase,
    private readonly getMovementStatusUseCase: GetMovementStatusUseCase,
    
    // Infrastructure Services
    private readonly movingEntitiesTrackingService: MovingEntitiesTrackingService,
  ) {}

  // Novos métodos baseados em eventos

  async requestMovement(dto: ExecuteMovementDto): Promise<any> {
    const source: any = {
      entityId: dto.source.sourceId,
      entityName: dto.source.sourceName,
      entityType: dto.source.sourceType as 'character' | 'creature' | 'npc' | 'system',
    };

    const event = await this.requestMovementUseCase.execute(
      dto.entityId,
      dto.fromPosition,
      dto.toPosition,
      dto.movementType,
      source,
      dto.speed,
    );

    return {
      eventId: event.getId(),
      entityId: dto.entityId,
      status: 'pending',
      message: 'Movimento agendado para processamento',
    };
  }

  async teleportEntity(
    entityId: string,
    targetPosition: { x: number; y: number; z: number },
    sourceEntityId: string,
    sourceName?: string,
  ): Promise<any> {
    const source: any = {
      entityId: sourceEntityId,
      entityName: sourceName || 'Sistema',
      entityType: 'system',
    };

    const event = await this.teleportEntityUseCase.execute(
      entityId,
      targetPosition,
      source
    );

    return {
      eventId: event.getId(),
      entityId: entityId,
      targetPosition,
      status: 'completed',
      message: 'Teleporte realizado com sucesso',
    };
  }

  async cancelMovement(
    entityId: string,
    reason?: string
  ): Promise<any> {
    const result = await this.cancelMovementUseCase.execute(entityId, reason);
    
    return {
      entityId,
      status: result ? 'cancelled' : 'not_found',
      message: result 
        ? `Movimento cancelado com sucesso: ${reason || 'Sem motivo especificado'}`
        : 'Nenhum movimento ativo encontrado para esta entidade',
    };
  }

  async getMovementStatus(entityId: string): Promise<any> {
    const status = await this.getMovementStatusUseCase.execute(entityId);
    
    if (!status) {
      return {
        entityId,
        isMoving: false,
        message: 'Entidade não está em movimento',
      };
    }
    
    return {
      entityId,
      isMoving: status.isMoving,
      currentPosition: status.currentPosition,
      targetPosition: status.targetPosition,
      speed: status.speed,
      lastMoveTime: status.lastMoveTime,
    };
  }

  // Métodos legados para compatibilidade

  async executeMovement(dto: ExecuteMovementDto): Promise<MovementResultResponseDto> {
    // Compatibilidade com versão anterior, agora redireciona para requestMovement
    const result = await this.requestMovement(dto);
    
    // Converte para o formato de resposta legado
    return {
      id: result.eventId,
      entityId: dto.entityId,
      fromPosition: dto.fromPosition,
      toPosition: dto.toPosition,
      success: true,
      message: 'Movimento solicitado com sucesso',
      timestamp: new Date(),
    };
  }

  async getMovementsByEntity(entityId: string, limit?: number): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getMovementsByEntity(entityId, limit);
    return movements.map(this.mapToMovementResponseDto);
  }

  async getRecentMovements(entityId: string, minutes: number = 60): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getRecentMovements(entityId, minutes);
    return movements.map(this.mapToMovementResponseDto);
  }

  async getMovementPath(entityId: string, limit?: number): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getMovementPath(entityId, limit);
    return movements.map(this.mapToMovementResponseDto);
  }

  async getLastMovement(entityId: string): Promise<MovementResponseDto | null> {
    const movement = await this.getMovementHistoryUseCase.getLastMovement(entityId);
    return movement ? this.mapToMovementResponseDto(movement) : null;
  }

  async getEntityPositionInfo(entityId: string): Promise<EntityPositionInfoResponseDto> {
    // Tenta obter da nova tracking service primeiro
    const trackingInfo = this.movingEntitiesTrackingService.getEntityState(entityId);
    
    if (trackingInfo) {
      return {
        entityId,
        position: trackingInfo.currentPosition,
        lastUpdated: trackingInfo.lastMoveTime,
        isMoving: trackingInfo.isMoving,
      };
    }
    
    // Fallback para o método legado se não encontrar
    const lastMovement = await this.getLastMovement(entityId);
    
    return {
      entityId,
      position: lastMovement?.toPosition || { x: 0, y: 0, z: 0 },
      lastUpdated: lastMovement?.timestamp || new Date(),
      isMoving: false,
    };
  }

  async getMovementsToPosition(x: number, y: number, z: number): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getMovementsToPosition(x, y, z);
    return movements.map(this.mapToMovementResponseDto);
  }

  async getMovementsFromPosition(x: number, y: number, z: number): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getMovementsFromPosition(x, y, z);
    return movements.map(this.mapToMovementResponseDto);
  }

  async getMovementsInArea(startX: number, startY: number, endX: number, endY: number, z: number): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getMovementsInArea(startX, startY, endX, endY, z);
    return movements.map(this.mapToMovementResponseDto);
  }

  async getEntitiesInRange(x: number, y: number, z: number, range: number): Promise<string[]> {
    // Primeiro verifica entidades em movimento ativo
    const activeEntities = this.movingEntitiesTrackingService.getEntitiesInRange({ x, y, z }, range);
    
    // Depois busca no histórico de movimentos
    const historicEntities = await this.getMovementHistoryUseCase.getEntitiesInRange(x, y, z, range);
    
    // Combina e remove duplicatas
    const allEntities = [...activeEntities, ...historicEntities];
    return [...new Set(allEntities)];
  }

  async getEntityStatistics(entityId: string): Promise<MovementStatisticsResponseDto> {
    return await this.getMovementStatisticsUseCase.getEntityStatistics(entityId);
  }

  async getGlobalStatistics(timeRangeMinutes?: number): Promise<MovementStatisticsResponseDto> {
    return await this.getMovementStatisticsUseCase.getGlobalStatistics(timeRangeMinutes);
  }

  async getMovementById(id: string): Promise<MovementResponseDto> {
    const movement = await this.movementRepository.findById(id);
    if (!movement) {
      throw new Error(`Movimento com ID ${id} não encontrado`);
    }
    return this.mapToMovementResponseDto(movement);
  }

  async deleteMovement(id: string): Promise<void> {
    await this.deleteMovementUseCase.execute(id);
  }

  async deleteMovementsByEntity(entityId: string): Promise<number> {
    return await this.deleteMovementUseCase.deleteByEntity(entityId);
  }

  async deleteOldMovements(days: number): Promise<number> {
    return await this.deleteMovementUseCase.deleteOlderThan(days);
  }

  // Método auxiliar para mapear entidade para DTO de resposta
  private mapToMovementResponseDto(movement: Movement): MovementResponseDto {
    return {
      id: movement.getId(),
      entityId: movement.getEntityId(),
      fromPosition: movement.getFromPosition(),
      toPosition: movement.getToPosition(),
      movementType: movement.getMovementType(),
      distance: movement.getDistance(),
      timestamp: movement.getTimestamp(),
      source: {
        sourceId: movement.getSource()?.entityId || 'system',
        sourceName: movement.getSource()?.entityName || 'System',
        sourceType: movement.getSource()?.entityType || 'system',
      },
    };
  }
}