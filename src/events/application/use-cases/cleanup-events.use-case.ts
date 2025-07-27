import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { EventRepository } from '../../domain/repositories/event.repository';
import { EVENT_REPOSITORY } from '../../domain/repositories/event.repository.token';

@Injectable()
export class CleanupEventsUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  /**
   * Exclui eventos mais antigos que uma determinada data.
   * @param days Número de dias para manter os eventos
   */
  async cleanupOldEvents(days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return this.eventRepository.deleteOlderThan(cutoffDate);
  }

  /**
   * Exclui um evento específico.
   */
  async deleteEvent(id: string): Promise<boolean> {
    return this.eventRepository.delete(id);
  }
}
