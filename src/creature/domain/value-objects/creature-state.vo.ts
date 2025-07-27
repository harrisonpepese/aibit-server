export interface StatusEffect {
  type: string;
  duration: number; // duração em milissegundos
  intensity: number; // intensidade do efeito (1-10)
}

export class CreatureState {
  private readonly currentHealth: number;
  private readonly currentMana: number;
  private readonly isAliveFlag: boolean;
  private readonly statusEffects: StatusEffect[];

  constructor(
    currentHealth: number,
    currentMana: number,
    isAlive: boolean,
    statusEffects: StatusEffect[] = []
  ) {
    this.validateState(currentHealth, currentMana);
    
    this.currentHealth = currentHealth;
    this.currentMana = currentMana;
    this.isAliveFlag = isAlive;
    this.statusEffects = [...statusEffects];
  }

  private validateState(currentHealth: number, currentMana: number): void {
    if (currentHealth < 0) {
      throw new Error('Vida atual não pode ser negativa');
    }

    if (currentMana < 0) {
      throw new Error('Mana atual não pode ser negativa');
    }
  }

  static create(maxHealth: number, maxMana: number = 0): CreatureState {
    return new CreatureState(maxHealth, maxMana, true, []);
  }

  static fromPrimitives(data: {
    currentHealth: number;
    currentMana: number;
    isAlive: boolean;
    statusEffects: Array<{
      type: string;
      duration: number;
      intensity: number;
    }>;
  }): CreatureState {
    return new CreatureState(
      data.currentHealth,
      data.currentMana,
      data.isAlive,
      data.statusEffects
    );
  }

  getCurrentHealth(): number {
    return this.currentHealth;
  }

  getCurrentMana(): number {
    return this.currentMana;
  }

  isAlive(): boolean {
    return this.isAliveFlag;
  }

  getStatusEffects(): StatusEffect[] {
    return [...this.statusEffects];
  }

  hasStatusEffect(type: string): boolean {
    return this.statusEffects.some(effect => effect.type === type);
  }

  getStatusEffect(type: string): StatusEffect | undefined {
    return this.statusEffects.find(effect => effect.type === type);
  }

  takeDamage(amount: number): CreatureState {
    if (amount <= 0) return this;

    const newHealth = Math.max(0, this.currentHealth - amount);
    const isStillAlive = newHealth > 0 && this.isAliveFlag;

    return new CreatureState(
      newHealth,
      this.currentMana,
      isStillAlive,
      this.statusEffects
    );
  }

  heal(amount: number): CreatureState {
    if (amount <= 0 || !this.isAliveFlag) return this;

    // Assumimos um limite implícito para a cura (maxHealth), mas como não temos acesso direto
    // a esse valor aqui, vamos simplesmente aumentar a vida atual
    const newHealth = this.currentHealth + amount;

    return new CreatureState(
      newHealth,
      this.currentMana,
      true,
      this.statusEffects
    );
  }

  useMana(amount: number): CreatureState | null {
    if (amount <= 0) return this;
    
    if (this.currentMana < amount) {
      return null; // Não há mana suficiente
    }

    return new CreatureState(
      this.currentHealth,
      this.currentMana - amount,
      this.isAliveFlag,
      this.statusEffects
    );
  }

  restoreMana(amount: number): CreatureState {
    if (amount <= 0 || !this.isAliveFlag) return this;

    const newMana = this.currentMana + amount;

    return new CreatureState(
      this.currentHealth,
      newMana,
      this.isAliveFlag,
      this.statusEffects
    );
  }

  die(): CreatureState {
    if (!this.isAliveFlag) return this;

    return new CreatureState(
      0,
      0,
      false,
      this.statusEffects
    );
  }

  revive(health: number, mana: number): CreatureState {
    if (this.isAliveFlag || health <= 0) return this;

    return new CreatureState(
      health,
      mana,
      true,
      [] // Remove todos os status effects ao reviver
    );
  }

  addStatusEffect(type: string, duration: number, intensity: number): CreatureState {
    if (!this.isAliveFlag) return this;

    // Verificar se já existe um efeito do mesmo tipo
    const existingEffectIndex = this.statusEffects.findIndex(effect => effect.type === type);
    
    let newStatusEffects = [...this.statusEffects];
    
    if (existingEffectIndex >= 0) {
      // Atualiza o efeito existente (substitui ou estende a duração/intensidade)
      newStatusEffects[existingEffectIndex] = {
        type,
        duration: Math.max(this.statusEffects[existingEffectIndex].duration, duration),
        intensity: Math.max(this.statusEffects[existingEffectIndex].intensity, intensity)
      };
    } else {
      // Adiciona um novo efeito
      newStatusEffects.push({ type, duration, intensity });
    }

    return new CreatureState(
      this.currentHealth,
      this.currentMana,
      this.isAliveFlag,
      newStatusEffects
    );
  }

  removeStatusEffect(type: string): CreatureState {
    if (!this.hasStatusEffect(type)) return this;

    const newStatusEffects = this.statusEffects.filter(effect => effect.type !== type);

    return new CreatureState(
      this.currentHealth,
      this.currentMana,
      this.isAliveFlag,
      newStatusEffects
    );
  }

  updateStatusEffects(elapsedTime: number): CreatureState {
    if (!this.isAliveFlag || this.statusEffects.length === 0) return this;

    // Atualiza duração dos efeitos e remove os expirados
    const updatedEffects = this.statusEffects
      .map(effect => ({
        ...effect,
        duration: effect.duration - elapsedTime
      }))
      .filter(effect => effect.duration > 0);

    return new CreatureState(
      this.currentHealth,
      this.currentMana,
      this.isAliveFlag,
      updatedEffects
    );
  }

  toPrimitives(): {
    currentHealth: number;
    currentMana: number;
    isAlive: boolean;
    statusEffects: Array<{
      type: string;
      duration: number;
      intensity: number;
    }>;
  } {
    return {
      currentHealth: this.currentHealth,
      currentMana: this.currentMana,
      isAlive: this.isAliveFlag,
      statusEffects: [...this.statusEffects]
    };
  }
}
