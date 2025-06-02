import { v4 as uuidv4 } from 'uuid';
import { Attack, AttackType, DamageType } from './attack.entity';
import { CombatEffect } from '../value-objects/combat-effect.vo';

export enum CombatEventType {
  ATTACK = 'ATTACK',
  APPLY_EFFECT = 'APPLY_EFFECT',
  PROCESS_EFFECT = 'PROCESS_EFFECT',
  REMOVE_EFFECT = 'REMOVE_EFFECT',
  END_COMBAT = 'END_COMBAT',
}

export enum CombatEventStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface CombatEventData {
  attack?: {
    attackerId: string;
    targetId: string;
    attackType: AttackType;
    damageType: DamageType;
    baseDamage: number;
    criticalChance?: number;
    accuracy?: number;
    targetDodgeChance?: number;
    targetBlockChance?: number;
    targetResistance?: number;
  };
  effect?: {
    effect: CombatEffect;
  };
  endCombat?: {
    reason?: string;
  };
}

export class CombatEvent {
  private readonly id: string;
  private readonly type: CombatEventType;
  private status: CombatEventStatus;
  private readonly data: CombatEventData;
  private readonly createdAt: Date;
  private processedAt: Date | null;
  private result: any | null;
  private readonly priority: number;
  private readonly participantIds: string[];

  constructor(
    type: CombatEventType,
    data: CombatEventData,
    participantIds: string[],
    priority: number = 0,
  ) {
    this.id = uuidv4();
    this.type = type;
    this.status = CombatEventStatus.PENDING;
    this.data = { ...data };
    this.createdAt = new Date();
    this.processedAt = null;
    this.result = null;
    this.priority = priority;
    this.participantIds = [...participantIds];

    this.validateEvent();
  }

  private validateEvent(): void {
    if (!this.type) {
      throw new Error('Tipo de evento de combate é obrigatório');
    }

    if (!this.participantIds || this.participantIds.length === 0) {
      throw new Error('IDs dos participantes são obrigatórios');
    }

    // Validações específicas por tipo de evento
    switch (this.type) {
      case CombatEventType.ATTACK:
        if (!this.data.attack) {
          throw new Error('Dados de ataque são obrigatórios para um evento de ataque');
        }
        break;
      case CombatEventType.APPLY_EFFECT:
      case CombatEventType.PROCESS_EFFECT:
      case CombatEventType.REMOVE_EFFECT:
        if (!this.data.effect) {
          throw new Error('Dados de efeito são obrigatórios para um evento de efeito');
        }
        break;
    }
  }

  getId(): string {
    return this.id;
  }

  getType(): CombatEventType {
    return this.type;
  }

  getStatus(): CombatEventStatus {
    return this.status;
  }

  getData(): CombatEventData {
    return { ...this.data };
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  getProcessedAt(): Date | null {
    return this.processedAt ? new Date(this.processedAt) : null;
  }

  getResult(): any | null {
    return this.result ? { ...this.result } : null;
  }

  getPriority(): number {
    return this.priority;
  }

  getParticipantIds(): string[] {
    return [...this.participantIds];
  }

  markAsProcessing(): void {
    this.status = CombatEventStatus.PROCESSING;
  }

  complete(result: any): void {
    this.status = CombatEventStatus.COMPLETED;
    this.processedAt = new Date();
    this.result = result;
  }

  fail(error: any): void {
    this.status = CombatEventStatus.FAILED;
    this.processedAt = new Date();
    this.result = { error };
  }

  isPending(): boolean {
    return this.status === CombatEventStatus.PENDING;
  }

  isProcessing(): boolean {
    return this.status === CombatEventStatus.PROCESSING;
  }

  isCompleted(): boolean {
    return this.status === CombatEventStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === CombatEventStatus.FAILED;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      data: this.data,
      createdAt: this.createdAt.toISOString(),
      processedAt: this.processedAt ? this.processedAt.toISOString() : null,
      result: this.result,
      priority: this.priority,
      participantIds: this.participantIds,
    };
  }
}
