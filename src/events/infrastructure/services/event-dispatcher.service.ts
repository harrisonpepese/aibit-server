import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GameEvent, GameEventType } from '../../domain/entities/game-event.entity';

/**
 * Serviço responsável por distribuir eventos para os módulos inscritos.
 * Implementa o padrão Observer/Pub-Sub para comunicação entre módulos.
 */
@Injectable()
export class EventDispatcherService {
  private eventBus = new Subject<GameEvent>();

  /**
   * Distribui um evento para todos os assinantes interessados.
   */
  dispatch(event: GameEvent): void {
    console.log(`[EventDispatcher] Distribuindo evento: ${event.getType()} (ID: ${event.getId()})`);
    this.eventBus.next(event);
  }

  /**
   * Assina todos os eventos.
   */
  subscribeToAll(): Observable<GameEvent> {
    return this.eventBus.asObservable();
  }

  /**
   * Assina eventos de um tipo específico.
   */
  subscribeToType(eventType: GameEventType): Observable<GameEvent> {
    return this.eventBus.pipe(
      filter(event => event.getType() === eventType)
    );
  }

  /**
   * Assina eventos de um módulo específico.
   */
  subscribeToSourceModule(module: string): Observable<GameEvent> {
    return this.eventBus.pipe(
      filter(event => event.getData().sourceModule === module)
    );
  }

  /**
   * Assina eventos visíveis para uma entidade específica.
   */
  subscribeToEntityVisibility(entityId: string): Observable<GameEvent> {
    return this.eventBus.pipe(
      filter(event => {
        const visibility = event.getVisibility();
        return (
          visibility.type === 'GLOBAL' ||
          (visibility.type === 'SPECIFIC_ENTITIES' && 
           visibility.entityIds && 
           visibility.entityIds.includes(entityId))
        );
      })
    );
  }

  /**
   * Assina eventos visíveis em uma área específica.
   */
  subscribeToAreaVisibility(x: number, y: number, z: number, radius: number): Observable<GameEvent> {
    return this.eventBus.pipe(
      filter(event => {
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
    );
  }
}
