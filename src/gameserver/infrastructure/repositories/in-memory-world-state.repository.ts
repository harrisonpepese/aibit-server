import { Injectable } from '@nestjs/common';
import { 
  WorldState, 
  WorldPlayer, 
  WorldCreature, 
  WorldTile, 
  WorldEvent 
} from '../../domain/entities/world-state.entity';
import { IWorldStateRepository } from '../../domain/repositories/world-state.repository.interface';

/**
 * In-memory implementation of world state repository
 */
@Injectable()
export class InMemoryWorldStateRepository implements IWorldStateRepository {
  private worldState: WorldState = new WorldState();
  
  async save(worldState: WorldState): Promise<void> {
    this.worldState = worldState;
  }
  
  async findById(id: string): Promise<WorldState | null> {
    // Since we only have one world state in memory, ignore id
    return this.worldState;
  }
  
  async findCurrent(): Promise<WorldState | null> {
    return this.worldState;
  }
  
  // Player operations
  async addOrUpdatePlayer(player: WorldPlayer): Promise<void> {
    this.worldState.addOrUpdatePlayer(player);
  }
  
  async removePlayer(playerId: string): Promise<boolean> {
    return this.worldState.removePlayer(playerId);
  }
  
  async findPlayerById(playerId: string): Promise<WorldPlayer | null> {
    return this.worldState.getPlayer(playerId) || null;
  }
  
  async findPlayerByCharacterId(characterId: string): Promise<WorldPlayer | null> {
    const allPlayers = this.worldState.getAllPlayers();
    return allPlayers.find(p => p.characterId === characterId) || null;
  }
  
  async findPlayersByArea(center: { x: number; y: number; z: number }, radius: number): Promise<WorldPlayer[]> {
    const { players } = this.worldState.getEntitiesInArea(center, radius);
    return players;
  }
  
  // Creature operations
  async addOrUpdateCreature(creature: WorldCreature): Promise<void> {
    this.worldState.addOrUpdateCreature(creature);
  }
  
  async removeCreature(creatureId: string): Promise<boolean> {
    return this.worldState.removeCreature(creatureId);
  }
  
  async findCreatureById(creatureId: string): Promise<WorldCreature | null> {
    return this.worldState.getCreature(creatureId) || null;
  }
  
  async findCreaturesByArea(center: { x: number; y: number; z: number }, radius: number): Promise<WorldCreature[]> {
    const { creatures } = this.worldState.getEntitiesInArea(center, radius);
    return creatures;
  }
  
  // Tile operations
  async addOrUpdateTile(tile: WorldTile): Promise<void> {
    this.worldState.addOrUpdateTile(tile);
  }
  
  async findTileByPosition(x: number, y: number, z: number): Promise<WorldTile | null> {
    return this.worldState.getTile(x, y, z) || null;
  }
  
  async findTilesByArea(center: { x: number; y: number; z: number }, radius: number): Promise<WorldTile[]> {
    const tiles: WorldTile[] = [];
    const { x, y, z } = center;
    
    for (let tileY = y - radius; tileY <= y + radius; tileY++) {
      for (let tileX = x - radius; tileX <= x + radius; tileX++) {
        const tile = this.worldState.getTile(tileX, tileY, z);
        if (tile) {
          tiles.push(tile);
        }
      }
    }
    
    return tiles;
  }
  
  // Event operations
  async addEvent(event: Omit<WorldEvent, 'id' | 'timestamp' | 'processed'>): Promise<WorldEvent> {
    return this.worldState.addEvent(event);
  }
  
  async markEventAsProcessed(eventId: string): Promise<boolean> {
    return this.worldState.markEventAsProcessed(eventId);
  }
  
  async findUnprocessedEvents(): Promise<WorldEvent[]> {
    return this.worldState.getUnprocessedEvents();
  }
  
  async clearOldProcessedEvents(maxAgeMs: number): Promise<number> {
    return this.worldState.clearOldProcessedEvents(maxAgeMs);
  }
}
