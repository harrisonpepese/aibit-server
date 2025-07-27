import { Injectable, Logger, Inject } from '@nestjs/common';
import { IWorldStateRepository } from '../../domain/repositories/world-state.repository.interface';
import { 
  WorldState, 
  WorldPlayer, 
  WorldCreature, 
  WorldTile, 
  WorldEvent 
} from '../../domain/entities/world-state.entity';
import { WorldUpdateDto } from '../../dto/websocket.dto';

@Injectable()
export class WorldStateService {
  private readonly logger = new Logger(WorldStateService.name);
  constructor(
    @Inject('IWorldStateRepository')
    private readonly worldStateRepository: IWorldStateRepository
  ) {}

  /**
   * Gets the current world state
   */
  async getCurrentWorldState(): Promise<WorldState | null> {
    return this.worldStateRepository.findCurrent();
  }

  /**
   * Adds or updates a player in the world state
   */
  async addOrUpdatePlayer(player: WorldPlayer): Promise<void> {
    await this.worldStateRepository.addOrUpdatePlayer(player);
    this.logger.debug(`Player ${player.id} (${player.name}) added/updated in world state`);
  }

  /**
   * Removes a player from the world state
   */
  async removePlayer(playerId: string): Promise<boolean> {
    const result = await this.worldStateRepository.removePlayer(playerId);
    if (result) {
      this.logger.debug(`Player ${playerId} removed from world state`);
    }
    return result;
  }

  /**
   * Gets a player by ID
   */
  async getPlayerById(playerId: string): Promise<WorldPlayer | null> {
    return this.worldStateRepository.findPlayerById(playerId);
  }

  /**
   * Gets a player by character ID
   */
  async getPlayerByCharacterId(characterId: string): Promise<WorldPlayer | null> {
    return this.worldStateRepository.findPlayerByCharacterId(characterId);
  }

  /**
   * Adds or updates a creature in the world state
   */
  async addOrUpdateCreature(creature: WorldCreature): Promise<void> {
    await this.worldStateRepository.addOrUpdateCreature(creature);
    this.logger.debug(`Creature ${creature.id} (${creature.name}) added/updated in world state`);
  }

  /**
   * Removes a creature from the world state
   */
  async removeCreature(creatureId: string): Promise<boolean> {
    const result = await this.worldStateRepository.removeCreature(creatureId);
    if (result) {
      this.logger.debug(`Creature ${creatureId} removed from world state`);
    }
    return result;
  }

  /**
   * Gets a creature by ID
   */
  async getCreatureById(creatureId: string): Promise<WorldCreature | null> {
    return this.worldStateRepository.findCreatureById(creatureId);
  }

  /**
   * Adds or updates a tile in the world state
   */
  async addOrUpdateTile(tile: WorldTile): Promise<void> {
    await this.worldStateRepository.addOrUpdateTile(tile);
  }

  /**
   * Gets a tile by position
   */
  async getTileByPosition(x: number, y: number, z: number): Promise<WorldTile | null> {
    return this.worldStateRepository.findTileByPosition(x, y, z);
  }

  /**
   * Adds an event to the world state
   */
  async addEvent(event: Omit<WorldEvent, 'id' | 'timestamp' | 'processed'>): Promise<WorldEvent> {
    const newEvent = await this.worldStateRepository.addEvent(event);
    this.logger.debug(`Event ${newEvent.id} (${newEvent.type}) added to world state`);
    return newEvent;
  }

  /**
   * Marks an event as processed
   */
  async markEventAsProcessed(eventId: string): Promise<boolean> {
    return this.worldStateRepository.markEventAsProcessed(eventId);
  }

  /**
   * Gets all unprocessed events
   */
  async getUnprocessedEvents(): Promise<WorldEvent[]> {
    return this.worldStateRepository.findUnprocessedEvents();
  }

  /**
   * Clears old processed events
   */
  async clearOldProcessedEvents(maxAgeMs: number = 3600000): Promise<number> {
    return this.worldStateRepository.clearOldProcessedEvents(maxAgeMs);
  }

  /**
   * Gets entities (players and creatures) in an area
   */
  async getEntitiesInArea(center: { x: number; y: number; z: number }, radius: number): Promise<{ players: WorldPlayer[]; creatures: WorldCreature[] }> {
    const players = await this.worldStateRepository.findPlayersByArea(center, radius);
    const creatures = await this.worldStateRepository.findCreaturesByArea(center, radius);
    
    return { players, creatures };
  }

  /**
   * Gets a world update for a specific area
   */
  async getWorldUpdateForArea(center: { x: number; y: number; z: number }, radius: number, includeTiles: boolean = false): Promise<WorldUpdateDto> {
    const { players, creatures } = await this.getEntitiesInArea(center, radius);
    const events = await this.worldStateRepository.findUnprocessedEvents();
    
    let tiles: WorldTile[] = [];
    if (includeTiles) {
      tiles = await this.worldStateRepository.findTilesByArea(center, radius);
    }
    
    return {
      timestamp: new Date().toISOString(),
      players: players.map(p => ({
        id: p.id,
        name: p.name,
        position: p.position,
        health: p.health,
        maxHealth: p.maxHealth,
        mana: p.mana,
        maxMana: p.maxMana,
        level: p.level
      })),
      creatures: creatures.map(c => ({
        id: c.id,
        type: c.type,
        name: c.name,
        position: c.position,
        health: c.health,
        maxHealth: c.maxHealth,
        level: c.level
      })),
      events: events.map(e => ({
        id: e.id,
        type: e.type,
        data: e.data,
        timestamp: e.timestamp.toISOString()
      })),
      tiles: includeTiles ? tiles.map(t => ({
        position: t.position,
        type: t.type,
        walkable: t.walkable,
        items: t.items
      })) : undefined
    };
  }
}
