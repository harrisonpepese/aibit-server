import { v4 as uuidv4 } from 'uuid';
import { CreatureType } from '../value-objects/creature-type.vo';
import { CreatureStats } from '../value-objects/creature-stats.vo';
import { CreatureState } from '../value-objects/creature-state.vo';
import { Position } from 'src/@shared/domain/value-objects/Position.vo';

export class Creature {
  private readonly id: string;
  private name: string;
  private type: CreatureType;
  private position: Position;
  private stats: CreatureStats;
  private state: CreatureState;
  private readonly spawnId: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(
    id: string,
    name: string,
    type: CreatureType,
    position: Position,
    stats: CreatureStats,
    state: CreatureState,
    spawnId: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.position = position;
    this.stats = stats;
    this.state = state;
    this.spawnId = spawnId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim() === '') {
      throw new Error('Nome da criatura não pode ser vazio');
    }

    if (this.name.length > 50) {
      throw new Error('Nome da criatura muito longo (máximo 50 caracteres)');
    }
  }

  static create(
    name: string,
    type: CreatureType,
    position: Position,
    stats: CreatureStats,
    spawnId: string | null = null,
  ): Creature {
    const now = new Date();
    
    return new Creature(
      uuidv4(),
      name,
      type,
      position,
      stats,
      CreatureState.create(stats.getMaxHealth()), // Inicialmente com vida cheia e estado normal
      spawnId,
      now,
      now,
    );
  }

  static fromPrimitives(data: {
    id: string;
    name: string;
    type: {
      value: string;
      isBoss: boolean;
      isHostile: boolean;
    };
    position: {
      x: number;
      y: number;
      z: number;
    };
    stats: {
      maxHealth: number;
      maxMana: number;
      attack: number;
      defense: number;
      speed: number;
      level: number;
      experience: number;
    };
    state: {
      currentHealth: number;
      currentMana: number;
      isAlive: boolean;
      statusEffects: Array<{
        type: string;
        duration: number;
        intensity: number;
      }>;
    };
    spawnId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Creature {
    return new Creature(
      data.id,
      data.name,
      CreatureType.fromPrimitives(data.type),
      new Position(data.position),
      CreatureStats.fromPrimitives(data.stats),
      CreatureState.fromPrimitives(data.state),
      data.spawnId,
      data.createdAt,
      data.updatedAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getType(): CreatureType {
    return this.type;
  }

  getPosition(): Position {
    return this.position;
  }

  getStats(): CreatureStats {
    return this.stats;
  }

  getState(): CreatureState {
    return this.state;
  }

  getSpawnId(): string | null {
    return this.spawnId;
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  updateName(name: string): void {
    this.name = name;
    this.validate();
    this.updatedAt = new Date();
  }

  updatePosition(position: Position): void {
    this.position = position;
    this.updatedAt = new Date();
  }

  updateStats(stats: CreatureStats): void {
    this.stats = stats;
    this.updatedAt = new Date();
  }

  updateState(state: CreatureState): void {
    this.state = state;
    this.updatedAt = new Date();
  }

  takeDamage(amount: number): void {
    const newState = this.state.takeDamage(amount);
    this.updateState(newState);
  }

  heal(amount: number): void {
    const newState = this.state.heal(amount);
    this.updateState(newState);
  }

  useMana(amount: number): boolean {
    const newState = this.state.useMana(amount);
    if (newState) {
      this.updateState(newState);
      return true;
    }
    return false;
  }

  restoreMana(amount: number): void {
    const newState = this.state.restoreMana(amount);
    this.updateState(newState);
  }

  die(): void {
    const newState = this.state.die();
    this.updateState(newState);
  }

  revive(): void {
    const newState = this.state.revive(this.stats.getMaxHealth(), this.stats.getMaxMana());
    this.updateState(newState);
  }

  addStatusEffect(type: string, duration: number, intensity: number): void {
    const newState = this.state.addStatusEffect(type, duration, intensity);
    this.updateState(newState);
  }

  removeStatusEffect(type: string): void {
    const newState = this.state.removeStatusEffect(type);
    this.updateState(newState);
  }

  isAlive(): boolean {
    return this.state.isAlive();
  }

  isHostile(): boolean {
    return this.type.isHostile();
  }

  isBoss(): boolean {
    return this.type.isBoss();
  }

  giveExperience(): number {
    return this.stats.getExperience();
  }

  toPrimitives(): {
    id: string;
    name: string;
    type: {
      value: string;
      isBoss: boolean;
      isHostile: boolean;
    };
    position: {
      x: number;
      y: number;
      z: number;
    };
    stats: {
      maxHealth: number;
      maxMana: number;
      attack: number;
      defense: number;
      speed: number;
      level: number;
      experience: number;
    };
    state: {
      currentHealth: number;
      currentMana: number;
      isAlive: boolean;
      statusEffects: Array<{
        type: string;
        duration: number;
        intensity: number;
      }>;
    };
    spawnId: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      name: this.name,
      type: this.type.toPrimitives(),
      position: this.position.toJSON(),
      stats: this.stats.toPrimitives(),
      state: this.state.toPrimitives(),
      spawnId: this.spawnId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
