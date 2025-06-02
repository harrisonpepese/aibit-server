import { Inject, Injectable } from '@nestjs/common';
import { GameMapRepository } from '../../domain/repositories/game-map.repository';
import { GAME_MAP_REPOSITORY } from '../../domain/repositories/game-map.repository.token';
import { GameMap } from '../../domain/entities/game-map.entity';
import { Position } from '../../../movement/domain/value-objects/position.vo';

@Injectable()
export class GetMapSectionUseCase {
  constructor(
    @Inject(GAME_MAP_REPOSITORY)
    private gameMapRepository: GameMapRepository,
  ) {}

  async execute(
    mapId: string,
    center: Position,
    radius: number,
  ): Promise<GameMap | null> {
    // Obter uma seção do mapa centrada em uma posição específica
    return this.gameMapRepository.getMapSection(mapId, center, radius);
  }
}
