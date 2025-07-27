import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GameEvent, GameEventType, EventVisibility } from './domain/entities/game-event.entity';
import { PublishEventUseCase } from './application/use-cases/publish-event.use-case';
import { GetEventsUseCase } from './application/use-cases/get-events.use-case';
import { SubscribeToEventsUseCase } from './application/use-cases/subscribe-to-events.use-case';
import { CleanupEventsUseCase } from './application/use-cases/cleanup-events.use-case';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly publishEventUseCase: PublishEventUseCase,
    private readonly getEventsUseCase: GetEventsUseCase,
    private readonly subscribeToEventsUseCase: SubscribeToEventsUseCase,
    private readonly cleanupEventsUseCase: CleanupEventsUseCase,
  ) {}

  /**
   * Publica um novo evento no sistema.
   */
  async publishEvent(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    const visibility: EventVisibility = {
      type: createEventDto.visibility.type,
      areaCenter: createEventDto.visibility.areaCenter,
      radius: createEventDto.visibility.radius,
      entityIds: createEventDto.visibility.entityIds,
    };

    const data = {
      sourceModule: createEventDto.sourceModule,
      sourceEvent: createEventDto.sourceEvent,
      ...createEventDto.data,
    };

    const event = await this.publishEventUseCase.execute(
      createEventDto.type,
      data,
      visibility,
      createEventDto.priority || 0,
    );

    return this.mapToEventResponseDto(event);
  }

  /**
   * Cria e publica um evento diretamente a partir de outro módulo.
   * Útil para integrações diretas entre módulos.
   */
  async createAndPublishEvent(
    type: GameEventType,
    sourceModule: string,
    data: any,
    visibility: EventVisibility,
    priority: number = 0,
  ): Promise<EventResponseDto> {
    const eventData = {
      sourceModule,
      ...data,
    };

    const event = await this.publishEventUseCase.execute(
      type,
      eventData,
      visibility,
      priority,
    );

    return this.mapToEventResponseDto(event);
  }

  /**
   * Busca eventos por tipo.
   */
  async findByType(type: string, limit?: number): Promise<EventResponseDto[]> {
    const events = await this.getEventsUseCase.getByType(type, limit);
    return events.map(this.mapToEventResponseDto);
  }

  /**
   * Busca eventos por status.
   */
  async findByStatus(status: string, limit?: number): Promise<EventResponseDto[]> {
    const events = await this.getEventsUseCase.getByStatus(status, limit);
    return events.map(this.mapToEventResponseDto);
  }

  /**
   * Busca eventos por módulo de origem.
   */
  async findBySourceModule(module: string, limit?: number): Promise<EventResponseDto[]> {
    const events = await this.getEventsUseCase.getBySourceModule(module, limit);
    return events.map(this.mapToEventResponseDto);
  }

  /**
   * Busca eventos visíveis para uma entidade específica.
   */
  async findVisibleToEntity(entityId: string, limit?: number): Promise<EventResponseDto[]> {
    const events = await this.getEventsUseCase.getVisibleToEntity(entityId, limit);
    return events.map(this.mapToEventResponseDto);
  }

  /**
   * Busca eventos visíveis em uma área específica.
   */
  async findVisibleInArea(x: number, y: number, z: number, radius: number, limit?: number): Promise<EventResponseDto[]> {
    const events = await this.getEventsUseCase.getVisibleInArea(x, y, z, radius, limit);
    return events.map(this.mapToEventResponseDto);
  }

  /**
   * Busca um evento pelo ID.
   */
  async findOne(id: string): Promise<EventResponseDto | null> {
    const event = await this.getEventsUseCase.getById(id);
    return event ? this.mapToEventResponseDto(event) : null;
  }

  /**
   * Exclui eventos mais antigos que um determinado número de dias.
   */
  async cleanupOldEvents(days: number): Promise<number> {
    return this.cleanupEventsUseCase.cleanupOldEvents(days);
  }

  /**
   * Exclui um evento específico.
   */
  async deleteEvent(id: string): Promise<boolean> {
    return this.cleanupEventsUseCase.deleteEvent(id);
  }

  /**
   * Assina todos os eventos.
   */
  subscribeToAll(): Observable<GameEvent> {
    return this.subscribeToEventsUseCase.subscribeToAll();
  }

  /**
   * Assina eventos de um tipo específico.
   */
  subscribeToType(eventType: GameEventType): Observable<GameEvent> {
    return this.subscribeToEventsUseCase.subscribeToType(eventType);
  }

  /**
   * Assina eventos de um módulo específico.
   */
  subscribeToSourceModule(module: string): Observable<GameEvent> {
    return this.subscribeToEventsUseCase.subscribeToSourceModule(module);
  }

  /**
   * Assina eventos visíveis para uma entidade específica.
   */
  subscribeToEntityVisibility(entityId: string): Observable<GameEvent> {
    return this.subscribeToEventsUseCase.subscribeToEntityVisibility(entityId);
  }

  /**
   * Assina eventos visíveis em uma área específica.
   */
  subscribeToAreaVisibility(x: number, y: number, z: number, radius: number): Observable<GameEvent> {
    return this.subscribeToEventsUseCase.subscribeToAreaVisibility(x, y, z, radius);
  }

  /**
   * Método auxiliar para mapear entidade para DTO de resposta.
   */
  private mapToEventResponseDto(event: GameEvent): EventResponseDto {
    return {
      id: event.getId(),
      type: event.getType(),
      status: event.getStatus(),
      data: event.getData(),
      createdAt: event.getCreatedAt().toISOString(),
      processedAt: event.getProcessedAt()?.toISOString() || null,
      result: event.getResult(),
      priority: event.getPriority(),
      visibility: event.getVisibility(),
    };
  }
}