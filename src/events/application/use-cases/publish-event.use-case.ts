import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GameEvent, GameEventType, EventVisibility } from '../../domain/entities/game-event.entity';
import { EventRepository } from '../../domain/repositories/event.repository';
import { EVENT_REPOSITORY } from '../../domain/repositories/event.repository.token';
import { EventProcessorService } from '../../infrastructure/services/event-processor.service';
import { EventDispatcherService } from '../../infrastructure/services/event-dispatcher.service';

@Injectable()
export class PublishEventUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    private readonly eventProcessorService: EventProcessorService,
    private readonly eventDispatcherService: EventDispatcherService,
  ) {}

  /**
   * Publica um novo evento no sistema.
   * O evento será processado e distribuído para os assinantes.
   */
  async execute(
    type: GameEventType,
    data: any,
    visibility: EventVisibility,
    priority: number = 0,
  ): Promise<GameEvent> {
    // Cria o evento
    const event = new GameEvent(
      type,
      data,
      visibility,
      priority,
    );
    
    // Salva o evento no repositório
    await this.eventRepository.save(event);
    
    // Adiciona o evento para processamento
    await this.eventProcessorService.addEvent(event);
    
    // Distribui o evento para os assinantes
    this.eventDispatcherService.dispatch(event);
    
    return event;
  }
}
