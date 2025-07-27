import { v4 as uuidv4 } from 'uuid';

/**
 * Interface que representa um evento do jogo armazenado no estado do mundo
 */
export interface WorldEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  processed: boolean;
}

/**
 * Interface que representa um jogador no estado do mundo
 */
export interface WorldPlayer {
  id: string;
  characterId: string;
  accountId: string;
  name: string;
  position: { x: number; y: number; z: number };
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  level: number;
  online: boolean;
  lastSeen: Date;
  clientId?: string; // ID da conexão do cliente associada
  metadata: Record<string, any>;
}

/**
 * Interface que representa uma criatura no estado do mundo
 */
export interface WorldCreature {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number; z: number };
  health: number;
  maxHealth: number;
  level: number;
  aggressive: boolean;
  respawnTime: number;
  metadata: Record<string, any>;
}

/**
 * Interface que representa um tile no mapa do mundo
 */
export interface WorldTile {
  id: string;
  position: { x: number; y: number; z: number };
  type: string;
  walkable: boolean;
  items: any[];
  metadata: Record<string, any>;
}

/**
 * Classe que representa o estado do mundo do jogo
 */
export class WorldState {
  private readonly id: string;
  private players: Map<string, WorldPlayer>;
  private creatures: Map<string, WorldCreature>;
  private map: Record<number, Record<number, Record<number, WorldTile>>>;
  private events: WorldEvent[];
  private lastUpdate: Date;
  private metadata: Record<string, any>;

  constructor() {
    this.id = uuidv4();
    this.players = new Map();
    this.creatures = new Map();
    this.map = {};
    this.events = [];
    this.lastUpdate = new Date();
    this.metadata = {};
  }

  /**
   * Adiciona ou atualiza um jogador no estado do mundo
   */
  addOrUpdatePlayer(player: WorldPlayer): void {
    this.players.set(player.id, { ...player });
    this.updateLastUpdate();
  }

  /**
   * Remove um jogador do estado do mundo
   */
  removePlayer(playerId: string): boolean {
    const removed = this.players.delete(playerId);
    if (removed) {
      this.updateLastUpdate();
    }
    return removed;
  }

  /**
   * Obtém um jogador do estado do mundo
   */
  getPlayer(playerId: string): WorldPlayer | undefined {
    return this.players.get(playerId);
  }

  /**
   * Obtém todos os jogadores do estado do mundo
   */
  getAllPlayers(): WorldPlayer[] {
    return Array.from(this.players.values());
  }

  /**
   * Adiciona ou atualiza uma criatura no estado do mundo
   */
  addOrUpdateCreature(creature: WorldCreature): void {
    this.creatures.set(creature.id, { ...creature });
    this.updateLastUpdate();
  }

  /**
   * Remove uma criatura do estado do mundo
   */
  removeCreature(creatureId: string): boolean {
    const removed = this.creatures.delete(creatureId);
    if (removed) {
      this.updateLastUpdate();
    }
    return removed;
  }

  /**
   * Obtém uma criatura do estado do mundo
   */
  getCreature(creatureId: string): WorldCreature | undefined {
    return this.creatures.get(creatureId);
  }

  /**
   * Obtém todas as criaturas do estado do mundo
   */
  getAllCreatures(): WorldCreature[] {
    return Array.from(this.creatures.values());
  }

  /**
   * Adiciona ou atualiza um tile no mapa do mundo
   */
  addOrUpdateTile(tile: WorldTile): void {
    const { x, y, z } = tile.position;
    
    if (!this.map[z]) {
      this.map[z] = {};
    }
    
    if (!this.map[z][y]) {
      this.map[z][y] = {};
    }
    
    this.map[z][y][x] = { ...tile };
    this.updateLastUpdate();
  }

  /**
   * Obtém um tile do mapa do mundo
   */
  getTile(x: number, y: number, z: number): WorldTile | undefined {
    return this.map[z]?.[y]?.[x];
  }

  /**
   * Adiciona um evento ao estado do mundo
   */
  addEvent(event: Omit<WorldEvent, 'id' | 'timestamp' | 'processed'>): WorldEvent {
    const newEvent: WorldEvent = {
      id: uuidv4(),
      timestamp: new Date(),
      processed: false,
      ...event,
    };
    
    this.events.push(newEvent);
    this.updateLastUpdate();
    
    return newEvent;
  }

  /**
   * Marca um evento como processado
   */
  markEventAsProcessed(eventId: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.processed = true;
      this.updateLastUpdate();
      return true;
    }
    return false;
  }

  /**
   * Obtém eventos não processados
   */
  getUnprocessedEvents(): WorldEvent[] {
    return this.events.filter(e => !e.processed);
  }

  /**
   * Limpa eventos processados mais antigos que um determinado tempo
   */
  clearOldProcessedEvents(maxAgeMs: number = 3600000): number {
    const now = new Date();
    const cutoff = new Date(now.getTime() - maxAgeMs);
    
    const initialLength = this.events.length;
    this.events = this.events.filter(e => !e.processed || e.timestamp > cutoff);
    
    const removedCount = initialLength - this.events.length;
    if (removedCount > 0) {
      this.updateLastUpdate();
    }
    
    return removedCount;
  }

  /**
   * Obtém a data da última atualização
   */
  getLastUpdate(): Date {
    return new Date(this.lastUpdate);
  }

  /**
   * Atualiza a data da última atualização
   */
  private updateLastUpdate(): void {
    this.lastUpdate = new Date();
  }

  /**
   * Obtém metadados do estado do mundo
   */
  getMetadata(): Record<string, any> {
    return { ...this.metadata };
  }

  /**
   * Atualiza metadados do estado do mundo
   */
  updateMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.updateLastUpdate();
  }

  /**
   * Obtém todas as entidades (jogadores e criaturas) em uma área específica
   */
  getEntitiesInArea(center: { x: number; y: number; z: number }, radius: number): { players: WorldPlayer[]; creatures: WorldCreature[] } {
    const { x, y, z } = center;
    const radiusSquared = radius * radius;
    
    const players = this.getAllPlayers().filter(player => {
      if (player.position.z !== z) return false;
      
      const dx = player.position.x - x;
      const dy = player.position.y - y;
      return (dx * dx + dy * dy) <= radiusSquared;
    });
    
    const creatures = this.getAllCreatures().filter(creature => {
      if (creature.position.z !== z) return false;
      
      const dx = creature.position.x - x;
      const dy = creature.position.y - y;
      return (dx * dx + dy * dy) <= radiusSquared;
    });
    
    return { players, creatures };
  }

  /**
   * Obtém uma visão simplificada do mundo para um cliente
   */
  getClientWorldView(center: { x: number; y: number; z: number }, radius: number): any {
    const { x, y, z } = center;
    const { players, creatures } = this.getEntitiesInArea(center, radius);
    
    // Coleta os tiles visíveis
    const tiles: WorldTile[] = [];
    const radiusSquared = radius * radius;
    
    // Percorre todas as posições na área
    for (let tileZ = z; tileZ <= z; tileZ++) { // Atualmente, só o mesmo nível Z
      for (let tileY = y - radius; tileY <= y + radius; tileY++) {
        for (let tileX = x - radius; tileX <= x + radius; tileX++) {
          const dx = tileX - x;
          const dy = tileY - y;
          
          // Verifica se está dentro do raio
          if ((dx * dx + dy * dy) <= radiusSquared) {
            const tile = this.getTile(tileX, tileY, tileZ);
            if (tile) {
              tiles.push(tile);
            }
          }
        }
      }
    }
    
    return {
      center,
      radius,
      players,
      creatures,
      tiles,
      timestamp: new Date(),
    };
  }

  /**
   * Converte o estado do mundo para um objeto plano
   */
  toJSON() {
    return {
      id: this.id,
      players: this.getAllPlayers(),
      creatures: this.getAllCreatures(),
      lastUpdate: this.lastUpdate.toISOString(),
      metadata: this.metadata,
      eventCount: this.events.length,
    };
  }
}
