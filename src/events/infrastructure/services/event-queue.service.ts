import { Injectable } from '@nestjs/common';
import { GameEvent } from '../../domain/entities/game-event.entity';

@Injectable()
export class EventQueueService {
  private queue: GameEvent[] = [];

  /**
   * Adiciona um evento à fila de processamento.
   */
  enqueue(event: GameEvent): void {
    this.queue.push(event);
    // Reordena a fila por prioridade (maior prioridade primeiro)
    this.queue.sort((a, b) => b.getPriority() - a.getPriority());
  }

  /**
   * Retorna todos os eventos pendentes na fila, sem removê-los.
   */
  getPendingEvents(): GameEvent[] {
    return this.queue.filter(event => event.isPending());
  }

  /**
   * Remove e retorna o próximo evento pendente na fila.
   */
  dequeue(): GameEvent | null {
    const index = this.queue.findIndex(event => event.isPending());
    if (index === -1) {
      return null;
    }
    const event = this.queue[index];
    this.queue.splice(index, 1);
    return event;
  }

  /**
   * Remove todos os eventos relacionados a uma entidade específica.
   */
  removeEntityEvents(entityId: string): void {
    this.queue = this.queue.filter(event => {
      const visibility = event.getVisibility();
      
      if (visibility.type === 'SPECIFIC_ENTITIES' && 
          visibility.entityIds && 
          visibility.entityIds.includes(entityId)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Remove todos os eventos de um determinado tipo.
   */
  removeEventsByType(type: string): void {
    this.queue = this.queue.filter(event => event.getType() !== type);
  }

  /**
   * Remove todos os eventos de um determinado módulo de origem.
   */
  removeEventsBySourceModule(module: string): void {
    this.queue = this.queue.filter(event => event.getData().sourceModule !== module);
  }

  /**
   * Retorna o número de eventos na fila.
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Limpa toda a fila de eventos.
   */
  clear(): void {
    this.queue = [];
  }
}
