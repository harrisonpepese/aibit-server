import { Module } from '@nestjs/common';
import { GameMapController } from './gamemap.controller';
import { GameMapService } from './gamemap.service';
import { CreateMapUseCase } from './application/use-cases/create-map.use-case';
import { GetMapSectionUseCase } from './application/use-cases/get-map-section.use-case';
import { UpdateTileUseCase } from './application/use-cases/update-tile.use-case';
import { InMemoryGameMapRepository } from './infrastructure/repositories/in-memory-game-map.repository';
import { GAME_MAP_REPOSITORY } from './domain/repositories/game-map.repository.token';

@Module({
  controllers: [GameMapController],
  providers: [
    GameMapService,
    CreateMapUseCase,
    GetMapSectionUseCase,
    UpdateTileUseCase,
    {
      provide: GAME_MAP_REPOSITORY,
      useClass: InMemoryGameMapRepository,
    },
  ],
  exports: [GameMapService],
})
export class GameMapModule {}