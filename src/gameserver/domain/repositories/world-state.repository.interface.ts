import { WorldState, WorldPlayer, WorldCreature, WorldTile, WorldEvent } from '../entities/world-state.entity';

/**
 * Interface for world state repository
 */
export interface IWorldStateRepository {
  save(worldState: WorldState): Promise<void>;
  findById(id: string): Promise<WorldState | null>;
  findCurrent(): Promise<WorldState | null>;
  
  // Player operations
  addOrUpdatePlayer(player: WorldPlayer): Promise<void>;
  removePlayer(playerId: string): Promise<boolean>;
  findPlayerById(playerId: string): Promise<WorldPlayer | null>;
  findPlayerByCharacterId(characterId: string): Promise<WorldPlayer | null>;
  findPlayersByArea(center: { x: number; y: number; z: number }, radius: number): Promise<WorldPlayer[]>;
  
  // Creature operations
  addOrUpdateCreature(creature: WorldCreature): Promise<void>;
  removeCreature(creatureId: string): Promise<boolean>;
  findCreatureById(creatureId: string): Promise<WorldCreature | null>;
  findCreaturesByArea(center: { x: number; y: number; z: number }, radius: number): Promise<WorldCreature[]>;
  
  // Tile operations
  addOrUpdateTile(tile: WorldTile): Promise<void>;
  findTileByPosition(x: number, y: number, z: number): Promise<WorldTile | null>;
  findTilesByArea(center: { x: number; y: number; z: number }, radius: number): Promise<WorldTile[]>;
  
  // Event operations
  addEvent(event: Omit<WorldEvent, 'id' | 'timestamp' | 'processed'>): Promise<WorldEvent>;
  markEventAsProcessed(eventId: string): Promise<boolean>;
  findUnprocessedEvents(): Promise<WorldEvent[]>;
  clearOldProcessedEvents(maxAgeMs: number): Promise<number>;
}
