import { Injectable } from '@nestjs/common';
import { EventRepository } from '../../domain/repositories/event.repository';
import { GameEvent, GameEventStatus } from '../../domain/entities/game-event.entity';

@Injectable()
export class InMemoryEventRepository implements EventRepository {
  private events: Map<string, GameEvent> = new Map();

  async save(event: GameEvent): Promise<GameEvent> {
    this.events.set(event.getId(), event);
    return event;
  }

  async findById(id: string): Promise<GameEvent | null> {
    return this.events.get(id) || null;
  }

  async findByType(type: string, limit?: number): Promise<GameEvent[]> {
    let result = Array.from(this.events.values())
      .filter(event => event.getType() === type)
      .sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime());
    
    if (limit) {
      result = result.slice(0, limit);
    }
    
    return result;
  }

  async findByStatus(status: string, limit?: number): Promise<GameEvent[]> {
    let result = Array.from(this.events.values())
      .filter(event => event.getStatus() === status)
      .sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime());
    
    if (limit) {
      result = result.slice(0, limit);
    }
    
    return result;
  }

  async findBySourceModule(module: string, limit?: number): Promise<GameEvent[]> {
    let result = Array.from(this.events.values())
      .filter(event => event.getData().sourceModule === module)
      .sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime());
    
    if (limit) {
      result = result.slice(0, limit);
    }
    
    return result;
  }

  async findByEntityVisibility(entityId: string, limit?: number): Promise<GameEvent[]> {
    let result = Array.from(this.events.values())
      .filter(event => {
        const visibility = event.getVisibility();
        return (
          visibility.type === 'GLOBAL' ||
          (visibility.type === 'SPECIFIC_ENTITIES' && 
           visibility.entityIds && 
           visibility.entityIds.includes(entityId))
        );
      })
      .sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime());
    
    if (limit) {
      result = result.slice(0, limit);
    }
    
    return result;
  }

  async findByAreaVisibility(
    x: number, 
    y: number, 
    z: number, 
    radius: number, 
    limit?: number
  ): Promise<GameEvent[]> {
    let result = Array.from(this.events.values())
      .filter(event => {
        const visibility = event.getVisibility();
        
        // Global events are visible everywhere
        if (visibility.type === 'GLOBAL') {
          return true;
        }
        
        // Area events are visible if the position is within the radius
        if (visibility.type === 'AREA' && 
            visibility.areaCenter && 
            visibility.radius !== undefined) {
          
          const dx = visibility.areaCenter.x - x;
          const dy = visibility.areaCenter.y - y;
          const dz = visibility.areaCenter.z - z;
          
          // If not on the same floor/level, it's not visible
          if (dz !== 0) {
            return false;
          }
          
          // Check if the position is within the radius
          const distanceSquared = dx * dx + dy * dy;
          const combinedRadius = visibility.radius + radius;
          
          return distanceSquared <= combinedRadius * combinedRadius;
        }
        
        return false;
      })
      .sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime());
    
    if (limit) {
      result = result.slice(0, limit);
    }
    
    return result;
  }

  async updateStatus(id: string, status: string, result?: any): Promise<GameEvent> {
    const event = this.events.get(id);
    if (!event) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    switch (status) {
      case GameEventStatus.PROCESSING:
        event.markAsProcessing();
        break;
      case GameEventStatus.COMPLETED:
        event.complete(result || {});
        break;
      case GameEventStatus.FAILED:
        event.fail(result || {});
        break;
      default:
        throw new Error(`Invalid status: ${status}`);
    }
    
    this.events.set(id, event);
    return event;
  }

  async delete(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const timestamp = date.getTime();
    let count = 0;
    
    for (const [id, event] of this.events.entries()) {
      if (event.getCreatedAt().getTime() < timestamp) {
        this.events.delete(id);
        count++;
      }
    }
    
    return count;
  }
}
