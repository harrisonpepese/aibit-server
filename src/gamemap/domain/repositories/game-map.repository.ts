import { GameMap } from '../entities/game-map.entity';
import { Position } from '../../../movement/domain/value-objects/position.vo';

export interface GameMapRepository {
  findById(id: string): Promise<GameMap | null>;
  findByName(name: string): Promise<GameMap | null>;
  findAll(): Promise<GameMap[]>;
  save(gameMap: GameMap): Promise<GameMap>;
  delete(id: string): Promise<boolean>;
  
  // Métodos específicos para otimização
  getMapSection(mapId: string, center: Position, radius: number): Promise<GameMap | null>;
  updateTiles(mapId: string, gameMap: GameMap): Promise<boolean>;
}
