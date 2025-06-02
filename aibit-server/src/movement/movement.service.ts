import { Injectable, NotFoundException } from '@nestjs/common';
import { ExecuteMovementUseCase } from './application/use-cases/execute-movement.use-case';
import { GetMovementHistoryUseCase } from './application/use-cases/get-movement-history.use-case';
import { GetMovementStatisticsUseCase } from './application/use-cases/get-movement-statistics.use-case';
import { DeleteMovementUseCase } from './application/use-cases/delete-movement.use-case';
import { ExecuteMovementDto } from './dto/execute-movement.dto';
import {
  MovementResultResponseDto,
  MovementResponseDto,
  MovementStatisticsResponseDto,
  EntityPositionInfoResponseDto,
  PositionResponseDto,
  MovementSourceResponseDto
} from './dto/movement-response.dto';
import { Position as PositionVO } from './domain/value-objects/position.vo';
import { MovementSpeed } from './domain/value-objects/movement-speed.vo';
import { Movement, MovementSource, Position } from './domain/entities/movement.entity';

@Injectable()
export class MovementService {
  constructor(
    private readonly executeMovementUseCase: ExecuteMovementUseCase,
    private readonly getMovementHistoryUseCase: GetMovementHistoryUseCase,
    private readonly getMovementStatisticsUseCase: GetMovementStatisticsUseCase,
    private readonly deleteMovementUseCase: DeleteMovementUseCase,
  ) {}

  async executeMovement(dto: ExecuteMovementDto): Promise<MovementResultResponseDto> {
    const fromPosition = new PositionVO(dto.fromPosition.x, dto.fromPosition.y, dto.fromPosition.z);
    const toPosition = new PositionVO(dto.toPosition.x, dto.toPosition.y, dto.toPosition.z);
    const speed = dto.speed ? new MovementSpeed(dto.speed) : undefined;

    const source: MovementSource = {
      entityId: dto.source.sourceId,
      entityName: dto.source.sourceName,
      entityType: dto.source.sourceType as 'character' | 'creature' | 'npc' | 'system',
    };

    const result = await this.executeMovementUseCase.execute({
      entityId: dto.entityId,
      fromPosition: this.mapPositionVOToPosition(fromPosition),
      toPosition: this.mapPositionVOToPosition(toPosition),
      movementType: dto.movementType,
      source,
      speed: speed?.getValue(),
      validateMovement: dto.validateMovement,
    });

    return {
      movement: result.movement ? this.mapMovementToResponseDto(result.movement) : null,
      status: result.status,
      actualPosition: this.mapPositionToResponseDto(result.actualPosition),
      staminaCost: result.staminaCost,
      duration: result.duration,
      collisions: result.collisions,
    };
  }

  async getMovementsByEntity(entityId: string, limit?: number): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getMovementsByEntity(entityId, limit);
    return movements.map(movement => this.mapMovementToResponseDto(movement));
  }

  async getRecentMovements(entityId: string, minutes?: number): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getRecentMovements(entityId, minutes || 5);
    return movements.map(movement => this.mapMovementToResponseDto(movement));
  }

  async getMovementPath(entityId: string, limit?: number): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getMovementPath(entityId, limit || 10);
    return movements.map(movement => this.mapMovementToResponseDto(movement));
  }

  async getLastMovement(entityId: string): Promise<MovementResponseDto | null> {
    const movement = await this.getMovementHistoryUseCase.getLastMovement(entityId);
    return movement ? this.mapMovementToResponseDto(movement) : null;
  }

  async getEntityPositionInfo(entityId: string): Promise<EntityPositionInfoResponseDto> {
    const lastMovement = await this.getMovementHistoryUseCase.getLastMovement(entityId);
    
    return {
      entityId,
      lastPosition: lastMovement ? this.mapPositionToResponseDto(lastMovement.getToPosition()) : null,
      lastMovementTime: lastMovement ? lastMovement.getTimestamp() : null,
      isOnline: this.isEntityOnline(lastMovement),
    };
  }

  async getEntityStatistics(entityId: string): Promise<MovementStatisticsResponseDto> {
    const stats = await this.getMovementStatisticsUseCase.getEntityStatistics(entityId);
    return this.mapStatisticsToResponseDto(stats);
  }

  async getMovementsToPosition(x: number, y: number, z: number): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getMovementsToPosition(x, y, z);
    return movements.map(movement => this.mapMovementToResponseDto(movement));
  }

  async getMovementsFromPosition(x: number, y: number, z: number): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getMovementsFromPosition(x, y, z);
    return movements.map(movement => this.mapMovementToResponseDto(movement));
  }

  async getMovementsInArea(startX: number, startY: number, endX: number, endY: number, z: number): Promise<MovementResponseDto[]> {
    const movements = await this.getMovementHistoryUseCase.getMovementsInArea(startX, startY, endX, endY, z);
    return movements.map(movement => this.mapMovementToResponseDto(movement));
  }

  async getEntitiesInRange(x: number, y: number, z: number, range: number): Promise<string[]> {
    // Como não existe este método no use case, vou implementar uma lógica básica
    const movements = await this.getMovementHistoryUseCase.getMovementsInArea(
      x - range, 
      y - range, 
      x + range, 
      y + range, 
      z
    );
    
    // Filtrar movimentos que estão exatamente dentro do range e extrair entidades únicas
    const entitiesInRange = new Set<string>();
    movements.forEach(movement => {
      const toPos = movement.getToPosition();
      const distance = Math.sqrt(
        Math.pow(toPos.x - x, 2) + 
        Math.pow(toPos.y - y, 2)
      );
      
      if (distance <= range) {
        entitiesInRange.add(movement.getEntityId());
      }
    });
    
    return Array.from(entitiesInRange);
  }

  async getGlobalStatistics(timeRangeMinutes?: number): Promise<MovementStatisticsResponseDto> {
    const stats = await this.getMovementStatisticsUseCase.getGlobalStatistics(timeRangeMinutes);
    return this.mapStatisticsToResponseDto(stats);
  }

  async getMovementById(id: string): Promise<MovementResponseDto> {
    const movement = await this.getMovementHistoryUseCase.getMovementById(id);
    if (!movement) {
      throw new NotFoundException(`Movement with ID ${id} not found`);
    }
    return this.mapMovementToResponseDto(movement);
  }

  async deleteMovement(id: string): Promise<void> {
    await this.deleteMovementUseCase.deleteById(id);
  }

  async deleteMovementsByEntity(entityId: string): Promise<number> {
    return await this.deleteMovementUseCase.deleteMovementsByEntity(entityId);
  }

  async deleteOldMovements(days: number): Promise<number> {
    return await this.deleteMovementUseCase.deleteOldMovements(days);
  }

  private mapMovementToResponseDto(movement: Movement): MovementResponseDto {
    return {
      id: movement.getId(),
      entityId: movement.getEntityId(),
      fromPosition: this.mapPositionToResponseDto(movement.getFromPosition()),
      toPosition: this.mapPositionToResponseDto(movement.getToPosition()),
      direction: movement.getDirection(),
      type: movement.getType(),
      source: this.mapSourceToResponseDto(movement.getSource()),
      timestamp: movement.getTimestamp(),
      duration: movement.getDuration(),
      staminaCost: movement.getStaminaCost(),
      speed: movement.getSpeed(),
      distance: movement.getDistance(),
    };
  }

  private mapPositionToResponseDto(position: Position): PositionResponseDto {
    return {
      x: position.x,
      y: position.y,
      z: position.z,
    };
  }

  private mapPositionVOToPosition(positionVO: PositionVO): Position {
    return {
      x: positionVO.getX(),
      y: positionVO.getY(),
      z: positionVO.getZ(),
    };
  }

  private mapSourceToResponseDto(source: MovementSource): MovementSourceResponseDto {
    return {
      sourceId: source.entityId,
      sourceName: source.entityName,
      sourceType: source.entityType,
    };
  }

  private mapStatisticsToResponseDto(stats: any): MovementStatisticsResponseDto {
    return {
      totalMovements: stats.totalMovements || 0,
      averageSpeed: stats.averageSpeed || 0,
      totalDistance: stats.totalDistance || 0,
      movementsByType: stats.movementsByType || {},
      mostActiveHour: stats.mostActiveHour || 0,
      averageMovementsPerDay: stats.averageMovementsPerDay || 0,
      fastestMovement: stats.fastestMovement || 0,
      slowestMovement: stats.slowestMovement || 0,
    };
  }

  private isEntityOnline(lastMovement: Movement | null): boolean {
    if (!lastMovement) return false;
    
    const lastMovementTime = lastMovement.getTimestamp();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    return lastMovementTime > fiveMinutesAgo;
  }
}