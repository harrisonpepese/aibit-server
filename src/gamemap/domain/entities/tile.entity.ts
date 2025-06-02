import { Position } from '../../../movement/domain/value-objects/position.vo';

export enum TileType {
  GROUND = 'GROUND',
  WALL = 'WALL',
  WATER = 'WATER',
  LAVA = 'LAVA',
  TELEPORT = 'TELEPORT',
  STAIRS_UP = 'STAIRS_UP',
  STAIRS_DOWN = 'STAIRS_DOWN',
}

export class Tile {
  private readonly position: Position;
  private readonly type: TileType;
  private readonly walkable: boolean;
  private readonly friction: number; // Afeta a velocidade de movimento (1.0 = normal)
  private readonly damagePerTurn: number; // Para tiles que causam dano (lava, etc)
  private readonly teleportDestination?: Position; // Para tiles de teleporte
  private readonly metadata: Record<string, any>; // Dados adicionais específicos para cada tipo

  constructor(
    position: Position,
    type: TileType,
    walkable: boolean = true,
    friction: number = 1.0,
    damagePerTurn: number = 0,
    teleportDestination?: Position,
    metadata: Record<string, any> = {},
  ) {
    this.position = position;
    this.type = type;
    this.walkable = walkable;
    this.friction = this.validateFriction(friction);
    this.damagePerTurn = Math.max(0, damagePerTurn);
    this.teleportDestination = teleportDestination;
    this.metadata = metadata;
    
    this.validateTileConfiguration();
  }

  private validateFriction(friction: number): number {
    // Garante que a fricção esteja entre 0.1 (muito lento) e 2.0 (muito rápido)
    return Math.max(0.1, Math.min(friction, 2.0));
  }

  private validateTileConfiguration(): void {
    // Validações específicas para cada tipo de tile
    if (this.type === TileType.TELEPORT && !this.teleportDestination) {
      throw new Error('Tiles de teleporte precisam ter um destino definido');
    }

    // Validações de regras de negócio
    if (this.type === TileType.WALL && this.walkable) {
      throw new Error('Tiles do tipo WALL não podem ser caminháveis');
    }

    if ((this.type === TileType.LAVA || this.type === TileType.WATER) && this.damagePerTurn === 0) {
      throw new Error(`Tiles do tipo ${this.type} devem causar dano por turno`);
    }
  }

  getPosition(): Position {
    return this.position;
  }

  getType(): TileType {
    return this.type;
  }

  isWalkable(): boolean {
    return this.walkable;
  }

  getFriction(): number {
    return this.friction;
  }

  getDamagePerTurn(): number {
    return this.damagePerTurn;
  }

  getTeleportDestination(): Position | undefined {
    return this.teleportDestination;
  }

  getMetadata(): Record<string, any> {
    return { ...this.metadata };
  }

  // Métodos de negócio
  canMoveTo(): boolean {
    return this.walkable;
  }

  causesDamage(): boolean {
    return this.damagePerTurn > 0;
  }

  isTeleport(): boolean {
    return this.type === TileType.TELEPORT && !!this.teleportDestination;
  }

  getMovementCost(): number {
    // Custo de movimento baseado na fricção do tile
    return 1 / this.friction;
  }

  toJSON() {
    return {
      position: this.position.toJSON(),
      type: this.type,
      walkable: this.walkable,
      friction: this.friction,
      damagePerTurn: this.damagePerTurn,
      teleportDestination: this.teleportDestination?.toJSON(),
      metadata: this.metadata,
    };
  }
}
