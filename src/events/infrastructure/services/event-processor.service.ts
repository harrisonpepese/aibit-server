import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GameEvent, GameEventStatus } from '../../domain/entities/game-event.entity';
import { EventRepository } from '../../domain/repositories/event.repository';
import { EVENT_REPOSITORY } from '../../domain/repositories/event.repository.token';
import { EventQueueService } from './event-queue.service';

@Injectable()
export class EventProcessorService implements OnModuleInit, OnModuleDestroy {
  private readonly PROCESSING_INTERVAL_MS = 100; // 100ms para processamento frequente
  private intervalId: NodeJS.Timeout | null = null;
  private processing = false;
  
  constructor(
    private readonly eventQueueService: EventQueueService,
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  onModuleInit() {
    // Inicia o processamento de eventos em ciclos regulares
    this.startProcessing();
  }

  onModuleDestroy() {
    // Para o processamento ao desligar o módulo
    this.stopProcessing();
  }

  startProcessing(): void {
    if (this.intervalId) {
      return; // Já está processando
    }

    this.intervalId = setInterval(() => this.processBatch(), this.PROCESSING_INTERVAL_MS);
    console.log(`[EventProcessor] Iniciando processamento de eventos a cada ${this.PROCESSING_INTERVAL_MS}ms`);
  }

  stopProcessing(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[EventProcessor] Processamento de eventos interrompido');
    }
  }

  // Processa um lote de eventos
  async processBatch(): Promise<void> {
    if (this.processing) {
      return; // Evita processamento paralelo do mesmo lote
    }

    this.processing = true;
    try {
      // Obtém eventos pendentes
      const pendingEvents = this.eventQueueService.getPendingEvents();
      
      if (pendingEvents.length > 0) {
        console.log(`[EventProcessor] Processando ${pendingEvents.length} eventos pendentes`);
      }
      
      // Processa cada evento
      for (const event of pendingEvents) {
        await this.processEvent(event);
      }
    } catch (error) {
      console.error('[EventProcessor] Erro ao processar lote de eventos:', error);
    } finally {
      this.processing = false;
    }
  }

  // Adiciona um evento à fila para processamento
  async addEvent(event: GameEvent): Promise<void> {
    this.eventQueueService.enqueue(event);
    await this.eventRepository.save(event);
    console.log(`[EventProcessor] Evento adicionado à fila: ${event.getType()} (ID: ${event.getId()})`);
  }

  // Processa um evento individual
  private async processEvent(event: GameEvent): Promise<void> {
    console.log(`[EventProcessor] Processando evento: ${event.getType()} (ID: ${event.getId()})`);
    
    event.markAsProcessing();
    await this.eventRepository.updateStatus(event.getId(), GameEventStatus.PROCESSING);
    
    try {
      // Aqui seria implementada a lógica específica de processamento
      // baseada no tipo de evento. No contexto atual, esse serviço apenas
      // marca o evento como processado para ser consumido pelo GameServerService.
      
      // Completa o evento
      event.complete({ processed: true, timestamp: new Date() });
      await this.eventRepository.updateStatus(
        event.getId(), 
        GameEventStatus.COMPLETED, 
        { processed: true, timestamp: new Date() }
      );
      
      console.log(`[EventProcessor] Evento processado com sucesso: ${event.getType()}`);
    } catch (error) {
      console.error(`[EventProcessor] Erro ao processar evento ${event.getType()}:`, error);
      
      event.fail(error);
      await this.eventRepository.updateStatus(
        event.getId(), 
        GameEventStatus.FAILED, 
        { error: error.message }
      );
    }
  }
}
