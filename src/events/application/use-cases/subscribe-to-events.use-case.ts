import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GameEvent, GameEventType } from '../../domain/entities/game-event.entity';
import { EventDispatcherService } from '../../infrastructure/services/event-dispatcher.service';

@Injectable()
export class SubscribeToEventsUseCase {
  constructor(
    private readonly eventDispatcherService: EventDispatcherService,
  ) {}

  /**
   * Assina todos os eventos.
   */
  subscribeToAll(): Observable<GameEvent> {
    return this.eventDispatcherService.subscribeToAll();
  }

  /**
   * Assina eventos de um tipo específico.
   */
  subscribeToType(eventType: GameEventType): Observable<GameEvent> {
    return this.eventDispatcherService.subscribeToType(eventType);
  }

  /**
   * Assina eventos de um módulo específico.
   */
  subscribeToSourceModule(module: string): Observable<GameEvent> {
    return this.eventDispatcherService.subscribeToSourceModule(module);
  }

  /**
   * Assina eventos visíveis para uma entidade específica.
   */
  subscribeToEntityVisibility(entityId: string): Observable<GameEvent> {
    return this.eventDispatcherService.subscribeToEntityVisibility(entityId);
  }

  /**
   * Assina eventos visíveis em uma área específica.
   */
  subscribeToAreaVisibility(x: number, y: number, z: number, radius: number): Observable<GameEvent> {
    return this.eventDispatcherService.subscribeToAreaVisibility(x, y, z, radius);
  }
}
