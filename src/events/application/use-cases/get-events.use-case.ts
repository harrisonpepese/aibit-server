import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GameEvent } from '../../domain/entities/game-event.entity';
import { EventRepository } from '../../domain/repositories/event.repository';
import { EVENT_REPOSITORY } from '../../domain/repositories/event.repository.token';

@Injectable()
export class GetEventsUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  /**
   * Busca eventos pelo tipo.
   */
  async getByType(type: string, limit?: number): Promise<GameEvent[]> {
    return this.eventRepository.findByType(type, limit);
  }

  /**
   * Busca eventos pelo status.
   */
  async getByStatus(status: string, limit?: number): Promise<GameEvent[]> {
    return this.eventRepository.findByStatus(status, limit);
  }

  /**
   * Busca eventos pelo módulo de origem.
   */
  async getBySourceModule(module: string, limit?: number): Promise<GameEvent[]> {
    return this.eventRepository.findBySourceModule(module, limit);
  }

  /**
   * Busca eventos visíveis para uma entidade específica.
   */
  async getVisibleToEntity(entityId: string, limit?: number): Promise<GameEvent[]> {
    return this.eventRepository.findByEntityVisibility(entityId, limit);
  }

  /**
   * Busca eventos visíveis em uma área específica.
   */
  async getVisibleInArea(x: number, y: number, z: number, radius: number, limit?: number): Promise<GameEvent[]> {
    return this.eventRepository.findByAreaVisibility(x, y, z, radius, limit);
  }

  /**
   * Busca um evento pelo ID.
   */
  async getById(id: string): Promise<GameEvent | null> {
    return this.eventRepository.findById(id);
  }
}
