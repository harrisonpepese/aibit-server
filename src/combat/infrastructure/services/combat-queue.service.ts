import { Injectable } from '@nestjs/common';
import { CombatEvent, CombatEventStatus } from '../domain/entities/combat-event.entity';

@Injectable()
export class CombatQueueService {
  private queue: CombatEvent[] = [];

  // Adiciona um evento à fila
  enqueue(event: CombatEvent): void {
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
  peek(): CombatEvent | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue[0];
  }

  // Remove e retorna o próximo evento da fila
  dequeue(): CombatEvent | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue.shift() || null;
  }

  // Obtém todos os eventos pendentes
  getPendingEvents(): CombatEvent[] {
    return this.queue.filter(event => event.getStatus() === CombatEventStatus.PENDING);
  }

  // Obtém eventos pendentes para um participante específico
  getPendingEventsForParticipant(participantId: string): CombatEvent[] {
    return this.queue.filter(
      event => 
        event.getStatus() === CombatEventStatus.PENDING && 
        event.getParticipantIds().includes(participantId)
    );
  }

  // Obtém todos os eventos (para debugging ou monitoramento)
  getAllEvents(): CombatEvent[] {
    return [...this.queue];
  }

  // Remove todos os eventos de um participante específico
  removeParticipantEvents(participantId: string): void {
    this.queue = this.queue.filter(
      event => !event.getParticipantIds().includes(participantId)
    );
  }

  // Verifica se a fila está vazia
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  // Retorna o tamanho da fila
  size(): number {
    return this.queue.length;
  }

  // Limpa a fila inteira
  clear(): void {
    this.queue = [];
  }
}
