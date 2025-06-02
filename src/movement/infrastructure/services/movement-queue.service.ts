import { Injectable } from '@nestjs/common';
import { MovementEvent, MovementEventStatus } from '../../domain/entities/movement-event.entity';

@Injectable()
export class MovementQueueService {
  private queue: MovementEvent[] = [];

  // Adiciona um evento à fila
  enqueue(event: MovementEvent): void {
    this.queue.push(event);
    // Ordena a fila por prioridade (maior prioridade primeiro) e depois por tempo de criação (mais antigo primeiro)
    this.queue.sort((a, b) => {
      if (a.getPriority() !== b.getPriority()) {
        return b.getPriority() - a.getPriority();
      }
      return a.getCreatedAt().getTime() - b.getCreatedAt().getTime();
    });
  }

  // Retorna o próximo evento na fila sem removê-lo
  peek(): MovementEvent | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue[0];
  }

  // Remove e retorna o próximo evento da fila
  dequeue(): MovementEvent | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue.shift() || null;
  }

  // Obtém todos os eventos pendentes
  getPendingEvents(): MovementEvent[] {
    return this.queue.filter(event => event.getStatus() === MovementEventStatus.PENDING);
  }

  // Obtém eventos pendentes para uma entidade específica
  getPendingEventsForEntity(entityId: string): MovementEvent[] {
    return this.queue.filter(
      event => 
        event.getStatus() === MovementEventStatus.PENDING && 
        event.getEntityIds().includes(entityId)
    );
  }

  // Obtém todos os eventos (para debugging ou monitoramento)
  getAllEvents(): MovementEvent[] {
    return [...this.queue];
  }

  // Remove todos os eventos de uma entidade específica
  removeEntityEvents(entityId: string): void {
    this.queue = this.queue.filter(
      event => !event.getEntityIds().includes(entityId)
    );
  }

  // Cancela todos os eventos pendentes de uma entidade
  cancelPendingEntityEvents(entityId: string, reason: string): number {
    let count = 0;
    this.queue.forEach(event => {
      if (event.isPending() && event.getEntityIds().includes(entityId)) {
        event.cancel(reason);
        count++;
      }
    });
    return count;
  }

  // Verifica se a fila está vazia
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  // Retorna o tamanho da fila
  size(): number {
    return this.queue.length;
  }

  // Retorna um snapshot da fila para monitoramento
  getQueueState(): any[] {
    return this.queue.map(event => ({
      id: event.getId(),
      type: event.getType(),
      status: event.getStatus(),
      entityIds: event.getEntityIds(),
      priority: event.getPriority(),
      createdAt: event.getCreatedAt(),
    }));
  }

  // Limpa a fila inteira
  clear(): void {
    this.queue = [];
  }
}
