export enum DamageType {
  PHYSICAL = 'physical',
  FIRE = 'fire',
  ICE = 'ice',
  ENERGY = 'energy',
  EARTH = 'earth',
  HOLY = 'holy',
  DEATH = 'death',
  HEALING = 'healing',
}

export enum StatusEffect {
  BURNING = 'burning',
  FROZEN = 'frozen',
  POISONED = 'poisoned',
  PARALYZED = 'paralyzed',
  BLESSED = 'blessed',
  CURSED = 'cursed',
  REGENERATING = 'regenerating',
  BLEEDING = 'bleeding',
}

export interface DamageResistance {
  type: DamageType;
  percentage: number; // 0-100
}

export interface StatusEffectData {
  effect: StatusEffect;
  duration: number; // em turnos/segundos
  intensity: number; // força do efeito
  source?: string; // fonte do efeito (spell, item, etc.)
}

export interface DamageSource {
  sourceId: string;
  sourceName: string;
  sourceType: 'character' | 'creature' | 'environment' | 'spell' | 'item';
}

export interface DamageCalculationResult {
  originalDamage: number;
  finalDamage: number;
  damageType: DamageType;
  wasBlocked: boolean;
  wasCritical: boolean;
  resistanceApplied: number;
  statusEffectsApplied: StatusEffectData[];
  source: DamageSource;
}

export class Damage {
  private readonly id: string;
  private readonly amount: number;
  private readonly type: DamageType;
  private readonly source: DamageSource;
  private readonly isCritical: boolean;
  private readonly statusEffects: StatusEffectData[];
  private readonly timestamp: Date;

  constructor(
    amount: number,
    type: DamageType,
    source: DamageSource,
    isCritical: boolean = false,
    statusEffects: StatusEffectData[] = [],
    id?: string,
    timestamp?: Date,
  ) {
    this.validateDamage(amount, type);
    
    this.id = id || this.generateId();
    this.amount = amount;
    this.type = type;
    this.source = source;
    this.isCritical = isCritical;
    this.statusEffects = [...statusEffects];
    this.timestamp = timestamp || new Date();
  }

  private validateDamage(amount: number, type: DamageType): void {
    if (amount < 0) {
      throw new Error('Quantidade de dano não pode ser negativa');
    }

    if (!Object.values(DamageType).includes(type)) {
      throw new Error('Tipo de dano inválido');
    }
  }

  private generateId(): string {
    return `dmg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getAmount(): number {
    return this.amount;
  }

  getType(): DamageType {
    return this.type;
  }

  getSource(): DamageSource {
    return { ...this.source };
  }

  getIsCritical(): boolean {
    return this.isCritical;
  }

  getStatusEffects(): StatusEffectData[] {
    return [...this.statusEffects];
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  // Métodos de negócio
  calculateFinalDamage(
    resistances: DamageResistance[],
    armor: number = 0,
    criticalMultiplier: number = 2.0,
  ): DamageCalculationResult {
    let finalDamage = this.amount;

    // Aplicar multiplicador crítico
    if (this.isCritical) {
      finalDamage *= criticalMultiplier;
    }

    // Aplicar resistências
    const resistance = resistances.find(r => r.type === this.type);
    let resistanceApplied = 0;
    
    if (resistance) {
      resistanceApplied = resistance.percentage;
      finalDamage *= (100 - resistance.percentage) / 100;
    }

    // Aplicar armadura (apenas para dano físico)
    if (this.type === DamageType.PHYSICAL) {
      const armorReduction = Math.min(armor * 0.1, finalDamage * 0.8); // Máximo 80% de redução
      finalDamage -= armorReduction;
    }

    // Garantir que o dano final não seja negativo
    finalDamage = Math.max(0, Math.floor(finalDamage));

    return {
      originalDamage: this.amount,
      finalDamage,
      damageType: this.type,
      wasBlocked: finalDamage === 0 && this.amount > 0,
      wasCritical: this.isCritical,
      resistanceApplied,
      statusEffectsApplied: this.statusEffects,
      source: this.source,
    };
  }

  isHealing(): boolean {
    return this.type === DamageType.HEALING;
  }

  hasStatusEffect(effect: StatusEffect): boolean {
    return this.statusEffects.some(se => se.effect === effect);
  }

  // Métodos estáticos para criação
  static createPhysicalDamage(
    amount: number,
    source: DamageSource,
    isCritical: boolean = false,
  ): Damage {
    return new Damage(amount, DamageType.PHYSICAL, source, isCritical);
  }

  static createMagicalDamage(
    amount: number,
    type: DamageType,
    source: DamageSource,
    statusEffects: StatusEffectData[] = [],
  ): Damage {
    if (type === DamageType.PHYSICAL) {
      throw new Error('Use createPhysicalDamage para dano físico');
    }
    
    return new Damage(amount, type, source, false, statusEffects);
  }

  static createHealing(
    amount: number,
    source: DamageSource,
    statusEffects: StatusEffectData[] = [],
  ): Damage {
    return new Damage(amount, DamageType.HEALING, source, false, statusEffects);
  }

  // Serialização
  toJSON() {
    return {
      id: this.id,
      amount: this.amount,
      type: this.type,
      source: this.source,
      isCritical: this.isCritical,
      statusEffects: this.statusEffects,
      timestamp: this.timestamp,
    };
  }
}
