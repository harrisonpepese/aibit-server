import { Inject, Injectable } from '@nestjs/common';
import { GameMapRepository } from '../../domain/repositories/game-map.repository';
import { GAME_MAP_REPOSITORY } from '../../domain/repositories/game-map.repository.token';
import { Tile, TileType } from '../../domain/entities/tile.entity';
import { Position } from '../../../movement/domain/value-objects/position.vo';

@Injectable()
export class UpdateTileUseCase {
  constructor(
    @Inject(GAME_MAP_REPOSITORY)
    private gameMapRepository: GameMapRepository,
  ) {}

  async execute(
    mapId: string,
    position: Position,
    type: TileType,
    walkable: boolean = true,
    friction: number = 1.0,
    damagePerTurn: number = 0,
    teleportDestination?: Position,
    metadata: Record<string, any> = {},
  ): Promise<boolean> {
    // Obter o mapa
    const gameMap = await this.gameMapRepository.findById(mapId);
    if (!gameMap) {
      throw new Error(`Mapa com ID ${mapId} não encontrado`);
    }

    // Verificar se a posição é válida para este mapa
    if (gameMap.isPositionOutOfBounds(position)) {
      throw new Error(`Posição ${position.toString()} está fora dos limites do mapa`);
    }

    // Criar e definir o novo tile
    const tile = new Tile(
      position,
      type,
      walkable,
      friction,
      damagePerTurn,
      teleportDestination,
      metadata,
    );

    gameMap.setTile(tile);

    // Atualizar o mapa
    return this.gameMapRepository.updateTiles(mapId, gameMap);
  }
}
