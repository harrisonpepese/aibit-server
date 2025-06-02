export enum CombatEffectType {
  DAMAGE_OVER_TIME = 'DAMAGE_OVER_TIME',
  HEALING_OVER_TIME = 'HEALING_OVER_TIME',
  STUN = 'STUN',
  SLOW = 'SLOW',
  BLEED = 'BLEED',
  POISON = 'POISON',
  BURN = 'BURN',
  FREEZE = 'FREEZE',
  BUFF = 'BUFF',
  DEBUFF = 'DEBUFF',
}

export class CombatEffect {
  private readonly type: CombatEffectType;
  private readonly value: number; // Valor do efeito (dano, cura, etc.)
  private readonly duration: number; // Duração em turnos
  private readonly interval: number; // Intervalo de aplicação em turnos (para efeitos periódicos)
  private readonly source: string; // ID da entidade que causou o efeito
  private readonly target: string; // ID da entidade afetada
  private readonly startTime: Date;
  private readonly metadata: Record<string, any>;

  constructor(
    type: CombatEffectType,
    value: number,
    duration: number,
    source: string,
    target: string,
    interval: number = 1,
    metadata: Record<string, any> = {},
  ) {
    this.validateEffect(value, duration, interval);
    
    this.type = type;
    this.value = value;
    this.duration = duration;
    this.interval = interval;
    this.source = source;
    this.target = target;
    this.startTime = new Date();
    this.metadata = { ...metadata };
  }

  private validateEffect(value: number, duration: number, interval: number): void {
    if (duration <= 0) {
      throw new Error('A duração do efeito deve ser maior que zero');
    }

    if (interval <= 0) {
      throw new Error('O intervalo do efeito deve ser maior que zero');
    }
  }

  getType(): CombatEffectType {
    return this.type;
  }

  getValue(): number {
    return this.value;
  }

  getDuration(): number {
    return this.duration;
  }

  getInterval(): number {
    return this.interval;
  }

  getSource(): string {
    return this.source;
  }

  getTarget(): string {
    return this.target;
  }

  getStartTime(): Date {
    return new Date(this.startTime);
  }

  getMetadata(): Record<string, any> {
    return { ...this.metadata };
  }

  // Calcula o valor total aplicado ao longo da duração total
  getTotalValue(): number {
    // Para efeitos periódicos (DOT, HOT), calcula o valor total
    if (this.isPeriodicEffect()) {
      const applications = Math.ceil(this.duration / this.interval);
      return this.value * applications;
    }
    // Para efeitos não periódicos, retorna o valor direto
    return this.value;
  }

  // Verifica se é um efeito periódico
  isPeriodicEffect(): boolean {
    return [
      CombatEffectType.DAMAGE_OVER_TIME,
      CombatEffectType.HEALING_OVER_TIME,
      CombatEffectType.BLEED,
      CombatEffectType.POISON,
      CombatEffectType.BURN,
    ].includes(this.type);
  }

  // Verifica se é um efeito de controle
  isControlEffect(): boolean {
    return [
      CombatEffectType.STUN,
      CombatEffectType.SLOW,
      CombatEffectType.FREEZE,
    ].includes(this.type);
  }

  // Verifica se causa dano
  isDamageEffect(): boolean {
    return [
      CombatEffectType.DAMAGE_OVER_TIME,
      CombatEffectType.BLEED,
      CombatEffectType.POISON,
      CombatEffectType.BURN,
    ].includes(this.type);
  }

  // Verifica se é um efeito de cura
  isHealingEffect(): boolean {
    return [
      CombatEffectType.HEALING_OVER_TIME,
    ].includes(this.type);
  }

  toJSON() {
    return {
      type: this.type,
      value: this.value,
      duration: this.duration,
      interval: this.interval,
      source: this.source,
      target: this.target,
      startTime: this.startTime.toISOString(),
      metadata: this.metadata,
    };
  }
}
