import { v4 as uuidv4 } from 'uuid';
import { Position, Direction, MovementType, MovementSource } from './movement.entity';

export enum MovementEventType {
  REQUEST_MOVEMENT = 'REQUEST_MOVEMENT',
  PROCESS_MOVEMENT = 'PROCESS_MOVEMENT',
  CANCEL_MOVEMENT = 'CANCEL_MOVEMENT',
  TELEPORT = 'TELEPORT',
  KNOCKBACK = 'KNOCKBACK',
  POSITION_UPDATE = 'POSITION_UPDATE',
}

export enum MovementEventStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface MovementEventData {
  movementRequest?: {
    entityId: string;
    fromPosition: Position;
    toPosition: Position;
    movementType: MovementType;
    source: MovementSource;
    speed?: number;
  };
  teleport?: {
    entityId: string;
    fromPosition: Position;
    toPosition: Position;
    source: MovementSource;
  };
  knockback?: {
    entityId: string;
    fromPosition: Position;
    toPosition: Position;
    source: MovementSource;
    strength: number;
  };
  cancel?: {
    reason: string;
  };
  positionUpdate?: {
    entityId: string;
    position: Position;
    direction: Direction;
  };
}

export class MovementEvent {
  private readonly id: string;
  private readonly type: MovementEventType;
  private status: MovementEventStatus;
  private readonly data: MovementEventData;
  private readonly createdAt: Date;
  private processedAt: Date | null;
  private result: any | null;
  private readonly priority: number;
  private readonly entityIds: string[];

  constructor(
    type: MovementEventType,
    data: MovementEventData,
    entityIds: string[],
    priority: number = 0,
  ) {
    this.id = uuidv4();
    this.type = type;
    this.status = MovementEventStatus.PENDING;
    this.data = { ...data };
    this.createdAt = new Date();
    this.processedAt = null;
    this.result = null;
    this.priority = priority;
    this.entityIds = [...entityIds];

    this.validateEvent();
  }

  private validateEvent(): void {
    if (!this.type) {
      throw new Error('Tipo de evento de movimento é obrigatório');
    }

    if (!this.entityIds || this.entityIds.length === 0) {
      throw new Error('IDs das entidades são obrigatórios');
    }

    // Validações específicas por tipo de evento
    switch (this.type) {
      case MovementEventType.REQUEST_MOVEMENT:
      case MovementEventType.PROCESS_MOVEMENT:
        if (!this.data.movementRequest) {
          throw new Error('Dados de requisição de movimento são obrigatórios');
        }
        break;
      case MovementEventType.TELEPORT:
        if (!this.data.teleport) {
          throw new Error('Dados de teleporte são obrigatórios');
        }
        break;
      case MovementEventType.KNOCKBACK:
        if (!this.data.knockback) {
          throw new Error('Dados de knockback são obrigatórios');
        }
        break;
      case MovementEventType.POSITION_UPDATE:
        if (!this.data.positionUpdate) {
          throw new Error('Dados de atualização de posição são obrigatórios');
        }
        break;
      case MovementEventType.CANCEL_MOVEMENT:
        if (!this.data.cancel) {
          throw new Error('Dados de cancelamento de movimento são obrigatórios');
        }
        break;
    }
  }

  getId(): string {
    return this.id;
  }

  getType(): MovementEventType {
    return this.type;
  }

  getStatus(): MovementEventStatus {
    return this.status;
  }

  getData(): MovementEventData {
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

  getEntityIds(): string[] {
    return [...this.entityIds];
  }

  markAsProcessing(): void {
    this.status = MovementEventStatus.PROCESSING;
  }

  complete(result: any): void {
    this.status = MovementEventStatus.COMPLETED;
    this.processedAt = new Date();
    this.result = result;
  }

  fail(error: any): void {
    this.status = MovementEventStatus.FAILED;
    this.processedAt = new Date();
    this.result = { error };
  }

  cancel(reason: string): void {
    this.status = MovementEventStatus.CANCELLED;
    this.processedAt = new Date();
    this.result = { reason };
  }

  isPending(): boolean {
    return this.status === MovementEventStatus.PENDING;
  }

  isProcessing(): boolean {
    return this.status === MovementEventStatus.PROCESSING;
  }

  isCompleted(): boolean {
    return this.status === MovementEventStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === MovementEventStatus.FAILED;
  }

  isCancelled(): boolean {
    return this.status === MovementEventStatus.CANCELLED;
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
      entityIds: this.entityIds,
    };
  }
}
