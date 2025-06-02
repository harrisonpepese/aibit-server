import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CombatEvent, CombatEventType } from '../../domain/entities/combat-event.entity';
import { Attack, AttackType, DamageType } from '../../domain/entities/attack.entity';
import { CombatQueueService } from './combat-queue.service';
import { CombatRepository } from '../../domain/repositories/combat.repository';
import { Inject } from '@nestjs/common';
import { COMBAT_REPOSITORY } from '../../domain/repositories/combat.repository.token';
import { CombatActiveParticipantsService } from './combat-active-participants.service';

@Injectable()
export class CombatEventProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly TURN_INTERVAL_MS = 2000; // 2 segundos
  private intervalId: NodeJS.Timeout | null = null;
  private processing = false;
  
  constructor(
    private readonly combatQueueService: CombatQueueService,
    private readonly activeParticipantsService: CombatActiveParticipantsService,
    @Inject(COMBAT_REPOSITORY)
    private readonly combatRepository: CombatRepository,
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

    this.intervalId = setInterval(() => this.processTurn(), this.TURN_INTERVAL_MS);
    console.log('[CombatEventProcessor] Iniciando processamento de eventos de combate a cada 2 segundos');
  }

  stopProcessing(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[CombatEventProcessor] Processamento de eventos de combate interrompido');
    }
  }

  // Processa um turno de combate
  async processTurn(): Promise<void> {
    if (this.processing) {
      console.log('[CombatEventProcessor] Ainda processando turno anterior, pulando...');
      return;
    }

    this.processing = true;
    try {
      console.log('[CombatEventProcessor] Processando turno de combate...');
      
      // Obtém eventos pendentes
      const pendingEvents = this.combatQueueService.getPendingEvents();
      console.log(`[CombatEventProcessor] ${pendingEvents.length} eventos pendentes para processar`);
      
      // Processa cada evento
      for (const event of pendingEvents) {
        await this.processEvent(event);
      }
    } catch (error) {
      console.error('[CombatEventProcessor] Erro ao processar turno de combate:', error);
    } finally {
      this.processing = false;
    }
  }

  // Adiciona um evento à fila para processamento
  async addEvent(event: CombatEvent): Promise<void> {
    this.combatQueueService.enqueue(event);
    console.log(`[CombatEventProcessor] Evento de combate adicionado à fila: ${event.getType()}`);
    
    // Marca os participantes como ativos em combate
    for (const participantId of event.getParticipantIds()) {
      this.activeParticipantsService.addParticipant(participantId);
    }
  }

  // Processa um evento individual
  private async processEvent(event: CombatEvent): Promise<void> {
    console.log(`[CombatEventProcessor] Processando evento: ${event.getType()} (ID: ${event.getId()})`);
    
    event.markAsProcessing();
    
    try {
      switch (event.getType()) {
        case CombatEventType.ATTACK:
          await this.processAttackEvent(event);
          break;
        case CombatEventType.APPLY_EFFECT:
          await this.processApplyEffectEvent(event);
          break;
        case CombatEventType.PROCESS_EFFECT:
          await this.processEffectTickEvent(event);
          break;
        case CombatEventType.REMOVE_EFFECT:
          await this.processRemoveEffectEvent(event);
          break;
        case CombatEventType.END_COMBAT:
          await this.processEndCombatEvent(event);
          break;
        default:
          throw new Error(`Tipo de evento não suportado: ${event.getType()}`);
      }
    } catch (error) {
      console.error(`[CombatEventProcessor] Erro ao processar evento ${event.getType()}:`, error);
      event.fail(error);
    }
  }

  // Processa um evento de ataque
  private async processAttackEvent(event: CombatEvent): Promise<void> {
    const attackData = event.getData().attack;
    if (!attackData) {
      throw new Error('Dados de ataque ausentes no evento');
    }

    const {
      attackerId,
      targetId,
      attackType,
      damageType,
      baseDamage,
      criticalChance = 0.05,
      accuracy = 0.9,
      targetDodgeChance = 0,
      targetBlockChance = 0,
      targetResistance = 0,
    } = attackData;

    // Cria um novo ataque
    const attack = new Attack(
      attackerId,
      targetId,
      attackType,
      damageType,
      baseDamage,
      criticalChance,
      accuracy,
    );

    // Calcula o resultado do ataque
    const result = attack.calculateResult(targetDodgeChance, targetBlockChance, targetResistance);

    // Completa o evento com o resultado
    event.complete({
      attack: attack.toJSON(),
      result,
    });

    console.log(`[CombatEventProcessor] Ataque processado: ${attackerId} -> ${targetId}, Dano: ${result.damage}`);
  }

  // Processa um evento para aplicar um efeito
  private async processApplyEffectEvent(event: CombatEvent): Promise<void> {
    const effectData = event.getData().effect;
    if (!effectData || !effectData.effect) {
      throw new Error('Dados de efeito ausentes no evento');
    }

    const effect = effectData.effect;

    // Completa o evento com o resultado
    event.complete({
      effect: effect,
      applied: true,
    });

    // Se for um efeito periódico, agenda eventos para processá-lo
    if (effect.isPeriodicEffect()) {
      // TODO: Agendar eventos PROCESS_EFFECT futuros para este efeito
    }

    console.log(`[CombatEventProcessor] Efeito aplicado: ${effect.getType()} em ${effect.getTarget()}`);
  }

  // Processa um tick de um efeito periódico
  private async processEffectTickEvent(event: CombatEvent): Promise<void> {
    const effectData = event.getData().effect;
    if (!effectData || !effectData.effect) {
      throw new Error('Dados de efeito ausentes no evento');
    }

    const effect = effectData.effect;

    // Lógica para aplicar um tick do efeito
    let result;
    if (effect.isDamageEffect()) {
      result = {
        damage: effect.getValue(),
        type: effect.getType(),
      };
    } else if (effect.isHealingEffect()) {
      result = {
        healing: effect.getValue(),
        type: effect.getType(),
      };
    } else {
      result = {
        applied: true,
        type: effect.getType(),
      };
    }

    // Completa o evento com o resultado
    event.complete({
      effect: effect,
      result,
    });

    console.log(`[CombatEventProcessor] Efeito processado: ${effect.getType()} em ${effect.getTarget()}`);
  }

  // Processa um evento para remover um efeito
  private async processRemoveEffectEvent(event: CombatEvent): Promise<void> {
    const effectData = event.getData().effect;
    if (!effectData || !effectData.effect) {
      throw new Error('Dados de efeito ausentes no evento');
    }

    const effect = effectData.effect;

    // Completa o evento com o resultado
    event.complete({
      effect: effect,
      removed: true,
    });

    console.log(`[CombatEventProcessor] Efeito removido: ${effect.getType()} de ${effect.getTarget()}`);
  }

  // Processa um evento para finalizar o combate
  private async processEndCombatEvent(event: CombatEvent): Promise<void> {
    const participantIds = event.getParticipantIds();

    // Remove todos os eventos pendentes desses participantes
    for (const participantId of participantIds) {
      this.combatQueueService.removeParticipantEvents(participantId);
      this.activeParticipantsService.removeParticipant(participantId);
    }

    // Completa o evento
    event.complete({
      participantIds,
      ended: true,
      reason: event.getData().endCombat?.reason || 'Combate finalizado',
    });

    console.log(`[CombatEventProcessor] Combate finalizado para participantes: ${participantIds.join(', ')}`);
  }
}
