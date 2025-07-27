import { v4 as uuidv4 } from 'uuid';

/**
 * Enum representando os tipos de eventos do jogo.
 * Cada módulo tem seu próprio conjunto de tipos de eventos.
 */
export enum GameEventType {
  // Eventos de Movimento
  MOVEMENT_REQUEST = 'MOVEMENT_REQUEST',
  MOVEMENT_COMPLETED = 'MOVEMENT_COMPLETED',
  MOVEMENT_FAILED = 'MOVEMENT_FAILED',
  ENTITY_TELEPORTED = 'ENTITY_TELEPORTED',
  
  // Eventos de Combate
  COMBAT_STARTED = 'COMBAT_STARTED',
  COMBAT_ENDED = 'COMBAT_ENDED',
  ATTACK_PERFORMED = 'ATTACK_PERFORMED',
  DAMAGE_DEALT = 'DAMAGE_DEALT',
  EFFECT_APPLIED = 'EFFECT_APPLIED',
  
  // Eventos de Mapa/Ambiente
  TILE_CHANGED = 'TILE_CHANGED',
  AREA_EFFECT_TRIGGERED = 'AREA_EFFECT_TRIGGERED',
  WEATHER_CHANGED = 'WEATHER_CHANGED',
  
  // Eventos de Entidade
  ENTITY_SPAWNED = 'ENTITY_SPAWNED',
  ENTITY_DESPAWNED = 'ENTITY_DESPAWNED',
  ENTITY_STATE_CHANGED = 'ENTITY_STATE_CHANGED',
  
  // Eventos de Item
  ITEM_DROPPED = 'ITEM_DROPPED',
  ITEM_PICKED = 'ITEM_PICKED',
  ITEM_USED = 'ITEM_USED',
  INVENTORY_CHANGED = 'INVENTORY_CHANGED',
  
  // Eventos de Chat
  MESSAGE_SENT = 'MESSAGE_SENT',
  
  // Eventos de Sistema
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',
  WORLD_STATE_UPDATED = 'WORLD_STATE_UPDATED',
}

/**
 * Enum representando o status de processamento de um evento.
 */
export enum GameEventStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * Interface para a área de visibilidade do evento.
 * Define quem deve receber a notificação do evento.
 */
export interface EventVisibility {
  type: 'GLOBAL' | 'AREA' | 'SPECIFIC_ENTITIES';
  areaCenter?: { x: number; y: number; z: number };
  radius?: number; // Para eventos em área, o raio de visibilidade
  entityIds?: string[]; // Para eventos específicos para entidades
}

/**
 * Interface para os dados do evento.
 * Contém informações específicas para cada tipo de evento.
 */
export interface GameEventData {
  // Campos comuns
  sourceModule: string; // Módulo que gerou o evento (ex: 'movement', 'combat', etc.)
  sourceEvent?: string; // ID do evento original (se for um evento derivado)
  metadata?: Record<string, any>; // Dados adicionais para o evento
  
  // Campos específicos para tipos de eventos
  [key: string]: any;
}

/**
 * Classe que representa um evento no jogo.
 * Eventos são usados para notificar diferentes partes do sistema sobre mudanças
 * no estado do jogo e para atualizar os clientes.
 */
export class GameEvent {
  private readonly id: string;
  private readonly type: GameEventType;
  private status: GameEventStatus;
  private readonly data: GameEventData;
  private readonly createdAt: Date;
  private processedAt: Date | null;
  private result: any | null;
  private readonly priority: number;
  private readonly visibility: EventVisibility;

  constructor(
    type: GameEventType,
    data: GameEventData,
    visibility: EventVisibility,
    priority: number = 0,
  ) {
    this.id = uuidv4();
    this.type = type;
    this.status = GameEventStatus.PENDING;
    this.data = { ...data };
    this.createdAt = new Date();
    this.processedAt = null;
    this.result = null;
    this.priority = priority;
    this.visibility = { ...visibility };

    this.validateEvent();
  }

  private validateEvent(): void {
    if (!this.type) {
      throw new Error('Tipo de evento é obrigatório');
    }

    if (!this.data.sourceModule) {
      throw new Error('Módulo de origem é obrigatório');
    }

    // Validação da visibilidade
    if (this.visibility.type === 'AREA' && 
       (!this.visibility.areaCenter || this.visibility.radius === undefined)) {
      throw new Error('Eventos com visibilidade de área precisam de centro e raio');
    }

    if (this.visibility.type === 'SPECIFIC_ENTITIES' && 
       (!this.visibility.entityIds || this.visibility.entityIds.length === 0)) {
      throw new Error('Eventos com visibilidade para entidades específicas precisam de IDs de entidades');
    }
  }

  getId(): string {
    return this.id;
  }

  getType(): GameEventType {
    return this.type;
  }

  getStatus(): GameEventStatus {
    return this.status;
  }

  getData(): GameEventData {
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

  getVisibility(): EventVisibility {
    return { ...this.visibility };
  }

  markAsProcessing(): void {
    this.status = GameEventStatus.PROCESSING;
  }

  complete(result: any): void {
    this.status = GameEventStatus.COMPLETED;
    this.processedAt = new Date();
    this.result = result;
  }

  fail(error: any): void {
    this.status = GameEventStatus.FAILED;
    this.processedAt = new Date();
    this.result = { error };
  }

  isPending(): boolean {
    return this.status === GameEventStatus.PENDING;
  }

  isProcessing(): boolean {
    return this.status === GameEventStatus.PROCESSING;
  }

  isCompleted(): boolean {
    return this.status === GameEventStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === GameEventStatus.FAILED;
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
      visibility: this.visibility,
    };
  }
}
