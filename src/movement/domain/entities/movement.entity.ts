export enum Direction {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west',
  NORTHEAST = 'northeast',
  NORTHWEST = 'northwest',
  SOUTHEAST = 'southeast',
  SOUTHWEST = 'southwest',
}

export enum MovementType {
  WALK = 'walk',
  RUN = 'run',
  TELEPORT = 'teleport',
  PUSH = 'push', // Empurrado por outro jogador/criatura
  KNOCKBACK = 'knockback', // Empurrado por spell/dano
}

export enum MovementStatus {
  SUCCESS = 'success',
  BLOCKED = 'blocked',
  INVALID_POSITION = 'invalid_position',
  INSUFFICIENT_STAMINA = 'insufficient_stamina',
  TOO_FAST = 'too_fast', // Rate limiting
  OUT_OF_BOUNDS = 'out_of_bounds',
}

export interface Position {
  x: number;
  y: number;
  z: number; // Floor/level
}

export interface MovementSource {
  entityId: string;
  entityName: string;
  entityType: 'character' | 'creature' | 'npc' | 'system';
}

export interface MovementValidation {
  isValid: boolean;
  reason?: string;
  blockedBy?: string; // ID da entidade que está bloqueando
  alternativePosition?: Position; // Posição alternativa sugerida
}

export interface MovementResult {
  movement: Movement;
  status: MovementStatus;
  actualPosition: Position;
  staminaCost: number;
  duration: number; // em milissegundos
  collisions: string[]; // IDs de entidades que foram colididas
}

export class Movement {
  private readonly id: string;
  private readonly entityId: string;
  private readonly fromPosition: Position;
  private readonly toPosition: Position;
  private readonly direction: Direction;
  private readonly type: MovementType;
  private readonly source: MovementSource;
  private readonly timestamp: Date;
  private readonly duration: number; // Tempo que levou para completar o movimento
  private readonly staminaCost: number;
  private readonly speed: number; // Velocidade do movimento (tiles por segundo)

  constructor(
    entityId: string,
    fromPosition: Position,
    toPosition: Position,
    type: MovementType,
    source: MovementSource,
    speed: number = 1.0,
    staminaCost: number = 0,
    duration?: number,
    id?: string,
    timestamp?: Date,
  ) {
    this.validateMovement(entityId, fromPosition, toPosition, speed);
    
    this.id = id || this.generateId();
    this.entityId = entityId;
    this.fromPosition = { ...fromPosition };
    this.toPosition = { ...toPosition };
    this.direction = this.calculateDirection(fromPosition, toPosition);
    this.type = type;
    this.source = { ...source };
    this.speed = speed;
    this.staminaCost = staminaCost;
    this.duration = duration || this.calculateDuration();
    this.timestamp = timestamp || new Date();
  }

  private validateMovement(
    entityId: string,
    fromPosition: Position,
    toPosition: Position,
    speed: number,
  ): void {
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    if (!fromPosition || !toPosition) {
      throw new Error('Posições de origem e destino são obrigatórias');
    }

    if (speed <= 0 || speed > 10) {
      throw new Error('Velocidade deve estar entre 0.1 e 10');
    }

    // Validar se as coordenadas são números válidos
    this.validatePosition(fromPosition, 'Posição de origem');
    this.validatePosition(toPosition, 'Posição de destino');
  }

  private validatePosition(position: Position, context: string): void {
    if (!Number.isInteger(position.x) || !Number.isInteger(position.y) || !Number.isInteger(position.z)) {
      throw new Error(`${context} deve ter coordenadas inteiras`);
    }

    if (position.x < 0 || position.y < 0 || position.z < 0) {
      throw new Error(`${context} não pode ter coordenadas negativas`);
    }

    if (position.x > 9999 || position.y > 9999 || position.z > 15) {
      throw new Error(`${context} está fora dos limites do mapa`);
    }
  }

  private generateId(): string {
    return `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateDirection(from: Position, to: Position): Direction {
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;

    // Movimento diagonal
    if (deltaX !== 0 && deltaY !== 0) {
      if (deltaX > 0 && deltaY > 0) return Direction.SOUTHEAST;
      if (deltaX > 0 && deltaY < 0) return Direction.NORTHEAST;
      if (deltaX < 0 && deltaY > 0) return Direction.SOUTHWEST;
      if (deltaX < 0 && deltaY < 0) return Direction.NORTHWEST;
    }

    // Movimento cardinal
    if (deltaX > 0) return Direction.EAST;
    if (deltaX < 0) return Direction.WEST;
    if (deltaY > 0) return Direction.SOUTH;
    if (deltaY < 0) return Direction.NORTH;

    // Sem movimento (teleporte para mesma posição)
    return Direction.NORTH; // Default
  }

  private calculateDuration(): number {
    const distance = this.getDistance();
    return Math.round((distance / this.speed) * 1000); // em milissegundos
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getEntityId(): string {
    return this.entityId;
  }

  getFromPosition(): Position {
    return { ...this.fromPosition };
  }

  getToPosition(): Position {
    return { ...this.toPosition };
  }

  getDirection(): Direction {
    return this.direction;
  }

  getType(): MovementType {
    return this.type;
  }

  getSource(): MovementSource {
    return { ...this.source };
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  getDuration(): number {
    return this.duration;
  }

  getStaminaCost(): number {
    return this.staminaCost;
  }

  getSpeed(): number {
    return this.speed;
  }

  // Métodos de negócio
  getDistance(): number {
    const deltaX = this.toPosition.x - this.fromPosition.x;
    const deltaY = this.toPosition.y - this.fromPosition.y;
    const deltaZ = this.toPosition.z - this.fromPosition.z;
    
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
  }

  getManhattanDistance(): number {
    return Math.abs(this.toPosition.x - this.fromPosition.x) + 
           Math.abs(this.toPosition.y - this.fromPosition.y) + 
           Math.abs(this.toPosition.z - this.fromPosition.z);
  }

  isDiagonal(): boolean {
    const deltaX = Math.abs(this.toPosition.x - this.fromPosition.x);
    const deltaY = Math.abs(this.toPosition.y - this.fromPosition.y);
    return deltaX > 0 && deltaY > 0;
  }

  isVerticalMovement(): boolean {
    return this.fromPosition.z !== this.toPosition.z;
  }

  isTeleport(): boolean {
    return this.type === MovementType.TELEPORT;
  }

  isPlayerInitiated(): boolean {
    return this.source.entityType === 'character' && 
           (this.type === MovementType.WALK || this.type === MovementType.RUN);
  }

  calculateStaminaBasedOnDistance(): number {
    const baseStamina = this.type === MovementType.RUN ? 2 : 1;
    const distanceMultiplier = this.isDiagonal() ? 1.4 : 1.0;
    const verticalMultiplier = this.isVerticalMovement() ? 2.0 : 1.0;
    
    return Math.ceil(baseStamina * distanceMultiplier * verticalMultiplier);
  }

  // Métodos estáticos para criação
  static createWalk(
    entityId: string,
    fromPosition: Position,
    toPosition: Position,
    source: MovementSource,
    speed: number = 1.0,
  ): Movement {
    const staminaCost = Math.ceil(speed > 0 ? 1 / speed : 1);
    return new Movement(entityId, fromPosition, toPosition, MovementType.WALK, source, speed, staminaCost);
  }

  static createRun(
    entityId: string,
    fromPosition: Position,
    toPosition: Position,
    source: MovementSource,
    speed: number = 2.0,
  ): Movement {
    const staminaCost = Math.ceil(speed > 0 ? 2 / speed : 2);
    return new Movement(entityId, fromPosition, toPosition, MovementType.RUN, source, speed, staminaCost);
  }

  static createTeleport(
    entityId: string,
    fromPosition: Position,
    toPosition: Position,
    source: MovementSource,
  ): Movement {
    return new Movement(entityId, fromPosition, toPosition, MovementType.TELEPORT, source, 10, 0, 0);
  }

  static createKnockback(
    entityId: string,
    fromPosition: Position,
    toPosition: Position,
    source: MovementSource,
  ): Movement {
    return new Movement(entityId, fromPosition, toPosition, MovementType.KNOCKBACK, source, 5, 0, 200);
  }

  // Serialização
  toJSON() {
    return {
      id: this.id,
      entityId: this.entityId,
      fromPosition: this.fromPosition,
      toPosition: this.toPosition,
      direction: this.direction,
      type: this.type,
      source: this.source,
      timestamp: this.timestamp,
      duration: this.duration,
      staminaCost: this.staminaCost,
      speed: this.speed,
      distance: this.getDistance(),
    };
  }
}
