import { Position } from 'src/@shared/domain/value-objects/Position.vo';
import { GameMap } from '../entities/game-map.entity';

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
