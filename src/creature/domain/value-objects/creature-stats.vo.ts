export class CreatureStats {
  private readonly maxHealth: number;
  private readonly maxMana: number;
  private readonly attack: number;
  private readonly defense: number;
  private readonly speed: number;
  private readonly level: number;
  private readonly experience: number;

  constructor(
    maxHealth: number,
    maxMana: number,
    attack: number,
    defense: number,
    speed: number,
    level: number,
    experience: number
  ) {
    this.validateStats(maxHealth, maxMana, attack, defense, speed, level, experience);
    
    this.maxHealth = maxHealth;
    this.maxMana = maxMana;
    this.attack = attack;
    this.defense = defense;
    this.speed = speed;
    this.level = level;
    this.experience = experience;
  }

  private validateStats(
    maxHealth: number,
    maxMana: number,
    attack: number,
    defense: number,
    speed: number,
    level: number,
    experience: number
  ): void {
    if (maxHealth <= 0) {
      throw new Error('Vida máxima deve ser maior que zero');
    }

    if (maxMana < 0) {
      throw new Error('Mana máxima não pode ser negativa');
    }

    if (attack < 0) {
      throw new Error('Ataque não pode ser negativo');
    }

    if (defense < 0) {
      throw new Error('Defesa não pode ser negativa');
    }

    if (speed <= 0) {
      throw new Error('Velocidade deve ser maior que zero');
    }

    if (level <= 0) {
      throw new Error('Nível deve ser maior que zero');
    }

    if (experience < 0) {
      throw new Error('Experiência não pode ser negativa');
    }
  }

  static fromPrimitives(data: {
    maxHealth: number;
    maxMana: number;
    attack: number;
    defense: number;
    speed: number;
    level: number;
    experience: number;
  }): CreatureStats {
    return new CreatureStats(
      data.maxHealth,
      data.maxMana,
      data.attack,
      data.defense,
      data.speed,
      data.level,
      data.experience
    );
  }

  getMaxHealth(): number {
    return this.maxHealth;
  }

  getMaxMana(): number {
    return this.maxMana;
  }

  getAttack(): number {
    return this.attack;
  }

  getDefense(): number {
    return this.defense;
  }

  getSpeed(): number {
    return this.speed;
  }

  getLevel(): number {
    return this.level;
  }

  getExperience(): number {
    return this.experience;
  }

  withModifiedHealth(newMaxHealth: number): CreatureStats {
    return new CreatureStats(
      newMaxHealth,
      this.maxMana,
      this.attack,
      this.defense,
      this.speed,
      this.level,
      this.experience
    );
  }

  withModifiedMana(newMaxMana: number): CreatureStats {
    return new CreatureStats(
      this.maxHealth,
      newMaxMana,
      this.attack,
      this.defense,
      this.speed,
      this.level,
      this.experience
    );
  }

  withModifiedAttack(newAttack: number): CreatureStats {
    return new CreatureStats(
      this.maxHealth,
      this.maxMana,
      newAttack,
      this.defense,
      this.speed,
      this.level,
      this.experience
    );
  }

  withModifiedDefense(newDefense: number): CreatureStats {
    return new CreatureStats(
      this.maxHealth,
      this.maxMana,
      this.attack,
      newDefense,
      this.speed,
      this.level,
      this.experience
    );
  }

  withModifiedSpeed(newSpeed: number): CreatureStats {
    return new CreatureStats(
      this.maxHealth,
      this.maxMana,
      this.attack,
      this.defense,
      newSpeed,
      this.level,
      this.experience
    );
  }

  levelUp(
    healthIncrease: number = 10,
    manaIncrease: number = 5,
    attackIncrease: number = 2,
    defenseIncrease: number = 2,
    speedIncrease: number = 0.1,
    experienceIncrease: number = 0
  ): CreatureStats {
    return new CreatureStats(
      this.maxHealth + healthIncrease,
      this.maxMana + manaIncrease,
      this.attack + attackIncrease,
      this.defense + defenseIncrease,
      this.speed + speedIncrease,
      this.level + 1,
      this.experience + experienceIncrease
    );
  }

  toPrimitives(): {
    maxHealth: number;
    maxMana: number;
    attack: number;
    defense: number;
    speed: number;
    level: number;
    experience: number;
  } {
    return {
      maxHealth: this.maxHealth,
      maxMana: this.maxMana,
      attack: this.attack,
      defense: this.defense,
      speed: this.speed,
      level: this.level,
      experience: this.experience
    };
  }

  static createDefault(level: number = 1): CreatureStats {
    // Fórmulas básicas para stats com base no nível
    const maxHealth = 50 + (level * 10);
    const maxMana = 20 + (level * 5);
    const attack = 5 + (level * 2);
    const defense = 5 + (level * 1);
    const speed = 1 + (level * 0.1);
    const experience = level * 25;

    return new CreatureStats(
      maxHealth,
      maxMana,
      attack,
      defense,
      speed,
      level,
      experience
    );
  }
}
