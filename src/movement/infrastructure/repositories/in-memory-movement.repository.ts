import { Injectable } from '@nestjs/common';
import { MovementRepository } from '../../domain/repositories/movement.repository';
import { Movement } from '../../domain/entities/movement.entity';

@Injectable()
export class InMemoryMovementRepository implements MovementRepository {
  private movements: Map<string, Movement> = new Map();
  private entityPositions: Map<string, { x: number; y: number; z: number; timestamp: Date }> = new Map();

  async save(movement: Movement): Promise<Movement> {
    this.movements.set(movement.getId(), movement);
    
    // Atualizar posição da entidade
    this.entityPositions.set(movement.getEntityId(), {
      x: movement.getToPosition().x,
      y: movement.getToPosition().y,
      z: movement.getToPosition().z,
      timestamp: movement.getTimestamp(),
    });

    return movement;
  }

  async findById(id: string): Promise<Movement | null> {
    return this.movements.get(id) || null;
  }

  async findAll(): Promise<Movement[]> {
    return Array.from(this.movements.values());
  }

  async delete(id: string): Promise<void> {
    this.movements.delete(id);
  }

  async findByEntityId(entityId: string): Promise<Movement[]> {
    return Array.from(this.movements.values())
      .filter(movement => movement.getEntityId() === entityId)
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());
  }

  async findRecentMovementsByEntity(entityId: string, minutes: number): Promise<Movement[]> {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    
    return Array.from(this.movements.values())
      .filter(movement => 
        movement.getEntityId() === entityId && 
        movement.getTimestamp() > cutoffTime
      )
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());
  }

  async findMovementsToPosition(x: number, y: number, z: number): Promise<Movement[]> {
    return Array.from(this.movements.values())
      .filter(movement => {
        const toPos = movement.getToPosition();
        return toPos.x === x && toPos.y === y && toPos.z === z;
      })
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());
  }

  async findMovementsFromPosition(x: number, y: number, z: number): Promise<Movement[]> {
    return Array.from(this.movements.values())
      .filter(movement => {
        const fromPos = movement.getFromPosition();
        return fromPos.x === x && fromPos.y === y && fromPos.z === z;
      })
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());
  }

  async findMovementsInArea(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    z: number
  ): Promise<Movement[]> {
    return Array.from(this.movements.values())
      .filter(movement => {
        const toPos = movement.getToPosition();
        return toPos.x >= startX && 
               toPos.x <= endX && 
               toPos.y >= startY && 
               toPos.y <= endY && 
               toPos.z === z;
      })
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());
  }

  async findByTimeRange(startTime: Date, endTime: Date): Promise<Movement[]> {
    return Array.from(this.movements.values())
      .filter(movement => 
        movement.getTimestamp() >= startTime && 
        movement.getTimestamp() <= endTime
      )
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());
  }

  async findRecentMovements(minutes: number): Promise<Movement[]> {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    
    return Array.from(this.movements.values())
      .filter(movement => movement.getTimestamp() > cutoffTime)
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());
  }

  async findByMovementType(type: string): Promise<Movement[]> {
    return Array.from(this.movements.values())
      .filter(movement => movement.getType() === type)
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());
  }

  async findBySource(sourceId: string): Promise<Movement[]> {
    return Array.from(this.movements.values())
      .filter(movement => movement.getSource().sourceId === sourceId)
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());
  }

  async countMovementsByEntity(entityId: string): Promise<number> {
    return Array.from(this.movements.values())
      .filter(movement => movement.getEntityId() === entityId)
      .length;
  }

  async countMovementsByTimeRange(startTime: Date, endTime: Date): Promise<number> {
    return Array.from(this.movements.values())
      .filter(movement => 
        movement.getTimestamp() >= startTime && 
        movement.getTimestamp() <= endTime
      )
      .length;
  }

  async getAverageSpeed(entityId: string): Promise<number> {
    const movements = Array.from(this.movements.values())
      .filter(movement => movement.getEntityId() === entityId);

    if (movements.length === 0) {
      return 0;
    }

    const totalSpeed = movements.reduce((sum, movement) => sum + movement.getSpeed(), 0);
    return totalSpeed / movements.length;
  }

  async getTotalDistance(entityId: string): Promise<number> {
    const movements = Array.from(this.movements.values())
      .filter(movement => movement.getEntityId() === entityId);

    return movements.reduce((total, movement) => total + movement.getDistance(), 0);
  }

  async getLastMovement(entityId: string): Promise<Movement | null> {
    const movements = await this.findByEntityId(entityId);
    return movements.length > 0 ? movements[0] : null;
  }

  async getMovementPath(entityId: string, limit?: number): Promise<Movement[]> {
    const movements = await this.findByEntityId(entityId);
    
    // Já está ordenado por timestamp decrescente
    return limit ? movements.slice(0, limit) : movements;
  }

  async findEntitiesInRange(x: number, y: number, z: number, range: number): Promise<string[]> {
    const entitiesInRange: string[] = [];

    for (const [entityId, position] of this.entityPositions.entries()) {
      if (position.z !== z) continue;

      const distance = Math.sqrt(
        Math.pow(position.x - x, 2) + 
        Math.pow(position.y - y, 2)
      );

      if (distance <= range) {
        entitiesInRange.push(entityId);
      }
    }

    return entitiesInRange;
  }

  // Métodos auxiliares para debugging e testes
  clear(): void {
    this.movements.clear();
    this.entityPositions.clear();
  }

  getSize(): number {
    return this.movements.size;
  }

  getEntityPosition(entityId: string): { x: number; y: number; z: number; timestamp: Date } | null {
    return this.entityPositions.get(entityId) || null;
  }

  getAllEntityPositions(): Map<string, { x: number; y: number; z: number; timestamp: Date }> {
    return new Map(this.entityPositions);
  }
}
