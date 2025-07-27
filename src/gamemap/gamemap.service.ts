import { Injectable } from '@nestjs/common';
import { CreateMapUseCase } from './application/use-cases/create-map.use-case';
import { GetMapSectionUseCase } from './application/use-cases/get-map-section.use-case';
import { UpdateTileUseCase } from './application/use-cases/update-tile.use-case';
import { CreateMapDto } from './dto/create-map.dto';
import { GetMapSectionDto } from './dto/get-map-section.dto';
import { UpdateTileDto } from './dto/update-tile.dto';
import { Position } from 'src/@shared/domain/value-objects/Position.vo';
import { GameMap } from './domain/entities/game-map.entity';

@Injectable()
export class GameMapService {
  constructor(
    private readonly createMapUseCase: CreateMapUseCase,
    private readonly getMapSectionUseCase: GetMapSectionUseCase,
    private readonly updateTileUseCase: UpdateTileUseCase,
  ) {}

  async findAll(): Promise<GameMap[]> {
    // Esta funcionalidade exigiria um caso de uso específico,
    // mas por enquanto vamos retornar um array vazio
    return [];
  }

  async findOne(id: string): Promise<GameMap | null> {
    // Esta funcionalidade exigiria um caso de uso específico
    const position = Position.zero();
    // Usando o GetMapSectionUseCase com um raio grande para obter o mapa inteiro
    return this.getMapSectionUseCase.execute(id, position, 1000);
  }

  async create(createMapDto: CreateMapDto): Promise<GameMap> {
    return this.createMapUseCase.execute(
      createMapDto.id,
      createMapDto.name,
      createMapDto.width,
      createMapDto.height,
      createMapDto.depth,
    );
  }

  async getMapSection(dto: GetMapSectionDto): Promise<GameMap | null> {
    const position = new Position(dto);
    return this.getMapSectionUseCase.execute(dto.mapId, position, dto.radius);
  }

  async updateTile(updateTileDto: UpdateTileDto): Promise<boolean> {
    const position = new Position(
      updateTileDto.position
    
    );

    let teleportDestination: Position | undefined;
    if (updateTileDto.teleportDestination) {
      teleportDestination = new Position(
        updateTileDto.teleportDestination
      );
    }

    return this.updateTileUseCase.execute(
      updateTileDto.mapId,
      position,
      updateTileDto.type,
      updateTileDto.walkable,
      updateTileDto.friction,
      updateTileDto.damagePerTurn,
      teleportDestination,
      updateTileDto.metadata,
    );
  }
}