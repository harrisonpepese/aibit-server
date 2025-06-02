import { Inject, Injectable } from '@nestjs/common';
import { GameMap } from '../../domain/entities/game-map.entity';
import { GameMapRepository } from '../../domain/repositories/game-map.repository';
import { GAME_MAP_REPOSITORY } from '../../domain/repositories/game-map.repository.token';

@Injectable()
export class CreateMapUseCase {
  constructor(
    @Inject(GAME_MAP_REPOSITORY)
    private gameMapRepository: GameMapRepository,
  ) {}

  async execute(
    id: string,
    name: string,
    width: number,
    height: number,
    depth: number = 16,
  ): Promise<GameMap> {
    // Verificar se já existe um mapa com o mesmo ID
    const existingMap = await this.gameMapRepository.findById(id);
    if (existingMap) {
      throw new Error(`Já existe um mapa com o ID: ${id}`);
    }

    // Verificar se já existe um mapa com o mesmo nome
    const existingMapByName = await this.gameMapRepository.findByName(name);
    if (existingMapByName) {
      throw new Error(`Já existe um mapa com o nome: ${name}`);
    }

    // Criar um novo mapa vazio
    const gameMap = GameMap.createEmpty(id, name, width, height, depth);

    // Salvar e retornar o mapa
    return this.gameMapRepository.save(gameMap);
  }
}
