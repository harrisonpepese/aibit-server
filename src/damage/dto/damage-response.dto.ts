import { DamageType, StatusEffect } from '../domain/entities/damage.entity';

export interface DamageSourceResponse {
  sourceId: string;
  sourceName: string;
  sourceType: string;
}

export interface StatusEffectResponse {
  effect: StatusEffect;
  duration: number;
  intensity: number;
  source?: string;
}

export interface DamageCalculationResultResponse {
  originalDamage: number;
  finalDamage: number;
  damageType: DamageType;
  wasBlocked: boolean;
  wasCritical: boolean;
  resistanceApplied: number;
  statusEffectsApplied: StatusEffectResponse[];
  source: DamageSourceResponse;
}

export class DamageResponseDto {
  id: string;
  amount: number;
  type: DamageType;
  source: DamageSourceResponse;
  isCritical: boolean;
  statusEffects: StatusEffectResponse[];
  timestamp: Date;

  constructor(damage: any) {
    this.id = damage.getId();
    this.amount = damage.getAmount();
    this.type = damage.getType();
    this.source = damage.getSource();
    this.isCritical = damage.getIsCritical();
    this.statusEffects = damage.getStatusEffects();
    this.timestamp = damage.getTimestamp();
  }
}

export class ApplyDamageResponseDto {
  damage: DamageResponseDto;
  calculationResult: DamageCalculationResultResponse;
  targetId: string;

  constructor(result: any) {
    this.damage = new DamageResponseDto(result.damage);
    this.calculationResult = result.calculationResult;
    this.targetId = result.targetId;
  }
}

export class DamageStatisticsResponseDto {
  totalDamageDealt: number;
  totalDamageReceived: number;
  damageByType: Record<DamageType, number>;
  criticalHits: number;
  totalHits: number;
  criticalRate: number;
  averageDamage: number;
  highestDamage: number;
  mostUsedDamageType: DamageType;

  constructor(stats: any) {
    this.totalDamageDealt = stats.totalDamageDealt;
    this.totalDamageReceived = stats.totalDamageReceived;
    this.damageByType = stats.damageByType;
    this.criticalHits = stats.criticalHits;
    this.totalHits = stats.totalHits;
    this.criticalRate = stats.criticalRate;
    this.averageDamage = stats.averageDamage;
    this.highestDamage = stats.highestDamage;
    this.mostUsedDamageType = stats.mostUsedDamageType;
  }
}
