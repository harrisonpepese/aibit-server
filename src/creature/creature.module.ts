import { Module } from '@nestjs/common';
import { CreatureController } from './creature.controller';
import { CreatureService } from './creature.service';
import { CreateCreatureUseCase } from './application/use-cases/create-creature.use-case';
import { GetCreaturesUseCase } from './application/use-cases/get-creatures.use-case';
import { UpdateCreatureUseCase } from './application/use-cases/update-creature.use-case';
import { CREATURE_REPOSITORY } from './domain/repositories/creature.repository.token';
import { InMemoryCreatureRepository } from './infrastructure/repositories/in-memory-creature.repository';

@Module({
  controllers: [CreatureController],
  providers: [
    CreatureService,
    CreateCreatureUseCase,
    GetCreaturesUseCase,
    UpdateCreatureUseCase,
    {
      provide: CREATURE_REPOSITORY,
      useClass: InMemoryCreatureRepository,
    },
  ],
  exports: [CreatureService],
})
export class CreatureModule {}