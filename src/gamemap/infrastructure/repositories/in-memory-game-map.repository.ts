import { Injectable } from '@nestjs/common';
import { GameMapRepository } from '../../domain/repositories/game-map.repository';
import { GameMap } from '../../domain/entities/game-map.entity';
import { Position } from '../../../movement/domain/value-objects/position.vo';

@Injectable()
export class InMemoryGameMapRepository implements GameMapRepository {
  private maps: Map<string, GameMap> = new Map();

  async findById(id: string): Promise<GameMap | null> {
    return this.maps.get(id) || null;
  }

  async findByName(name: string): Promise<GameMap | null> {
    for (const map of this.maps.values()) {
      if (map.getName() === name) {
        return map;
      }
    }
    return null;
  }

  async findAll(): Promise<GameMap[]> {
    return Array.from(this.maps.values());
  }

  async save(gameMap: GameMap): Promise<GameMap> {
    this.maps.set(gameMap.getId(), gameMap);
    return gameMap;
  }

  async delete(id: string): Promise<boolean> {
    return this.maps.delete(id);
  }

  async getMapSection(mapId: string, center: Position, radius: number): Promise<GameMap | null> {
    const map = await this.findById(mapId);
    if (!map) {
      return null;
    }

    // Criar um novo mapa contendo apenas os tiles dentro do raio
    const mapSection = GameMap.createEmpty(
      `${mapId}_section`,
      `${map.getName()} Section`,
      radius * 2 + 1,
      radius * 2 + 1,
      1 // Apenas o nível atual
    );

    const tiles = map.getTilesInRadius(center, radius);
    tiles.forEach(tile => {
      try {
        mapSection.setTile(tile);
      } catch (error) {
        // Ignora tiles que estão fora dos limites do mapa de seção
      }
    });

    return mapSection;
  }

  async updateTiles(mapId: string, gameMap: GameMap): Promise<boolean> {
    const map = await this.findById(mapId);
    if (!map) {
      return false;
    }

    this.maps.set(mapId, gameMap);
    return true;
  }
}
