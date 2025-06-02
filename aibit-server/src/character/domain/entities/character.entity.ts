import { v4 as uuidv4 } from 'uuid';

export interface CharacterStats {
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  experience: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
}

export interface CharacterPosition {
  x: number;
  y: number;
  z: number;
}

export class Character {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  private stats: CharacterStats;
  private position: CharacterPosition;
  private isOnline: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    accountId: string,
    name: string,
    id?: string,
    stats?: Partial<CharacterStats>,
    position?: CharacterPosition,
    isOnline?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.validateName(name);
    this.validateAccountId(accountId);

    this.id = id || uuidv4();
    this.accountId = accountId;
    this.name = name;
    this.stats = this.initializeStats(stats);
    this.position = position || { x: 100, y: 100, z: 7 }; // Posição inicial padrão
    this.isOnline = isOnline || false;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome do personagem é obrigatório');
    }

    if (name.length < 3 || name.length > 20) {
      throw new Error('Nome do personagem deve ter entre 3 e 20 caracteres');
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      throw new Error('Nome do personagem deve conter apenas letras e espaços');
    }
  }

  private validateAccountId(accountId: string): void {
    if (!accountId || accountId.trim().length === 0) {
      throw new Error('ID da conta é obrigatório');
    }
  }

  private initializeStats(stats?: Partial<CharacterStats>): CharacterStats {
    const defaultStats: CharacterStats = {
      level: 1,
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      experience: 0,
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      vitality: 10,
    };

    return { ...defaultStats, ...stats };
  }

  // Getters
  getStats(): CharacterStats {
    return { ...this.stats };
  }

  getPosition(): CharacterPosition {
    return { ...this.position };
  }

  getIsOnline(): boolean {
    return this.isOnline;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Métodos de negócio
  takeDamage(damage: number): void {
    if (damage < 0) {
      throw new Error('Dano não pode ser negativo');
    }

    this.stats.health = Math.max(0, this.stats.health - damage);
    this.updatedAt = new Date();
  }

  heal(amount: number): void {
    if (amount < 0) {
      throw new Error('Quantidade de cura não pode ser negativa');
    }

    this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
    this.updatedAt = new Date();
  }

  gainExperience(amount: number): boolean {
    if (amount < 0) {
      throw new Error('Experiência não pode ser negativa');
    }

    this.stats.experience += amount;
    const leveledUp = this.checkLevelUp();
    this.updatedAt = new Date();
    
    return leveledUp;
  }

  private checkLevelUp(): boolean {
    const experienceRequired = this.getExperienceForLevel(this.stats.level + 1);
    
    if (this.stats.experience >= experienceRequired) {
      this.levelUp();
      return true;
    }
    
    return false;
  }

  private getExperienceForLevel(level: number): number {
    // Fórmula simples para experiência necessária por nível
    return level * 100;
  }

  private levelUp(): void {
    this.stats.level++;
    
    // Aumenta os stats base ao subir de nível
    this.stats.maxHealth += 10;
    this.stats.maxMana += 5;
    this.stats.strength += 1;
    this.stats.dexterity += 1;
    this.stats.intelligence += 1;
    this.stats.vitality += 1;
    
    // Restaura saúde e mana completamente
    this.stats.health = this.stats.maxHealth;
    this.stats.mana = this.stats.maxMana;
  }

  moveTo(position: CharacterPosition): void {
    if (position.x < 0 || position.y < 0 || position.z < 0) {
      throw new Error('Posição não pode ter coordenadas negativas');
    }

    this.position = { ...position };
    this.updatedAt = new Date();
  }

  setOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
    this.updatedAt = new Date();
  }

  isDead(): boolean {
    return this.stats.health <= 0;
  }

  canLevelUp(): boolean {
    const experienceRequired = this.getExperienceForLevel(this.stats.level + 1);
    return this.stats.experience >= experienceRequired;
  }

  // Método para serialização
  toJSON() {
    return {
      id: this.id,
      accountId: this.accountId,
      name: this.name,
      stats: this.stats,
      position: this.position,
      isOnline: this.isOnline,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
