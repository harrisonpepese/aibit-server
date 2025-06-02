import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { CreateCharacterUseCase } from './application/use-cases/create-character.use-case';
import { GetCharacterUseCase } from './application/use-cases/get-character.use-case';
import { UpdateCharacterUseCase } from './application/use-cases/update-character.use-case';
import { DeleteCharacterUseCase } from './application/use-cases/delete-character.use-case';
import { CHARACTER_REPOSITORY_TOKEN } from './domain/repositories/character.repository.token';
import { InMemoryCharacterRepository } from './infrastructure/repositories/in-memory-character.repository';

@Module({
  controllers: [CharacterController],
  providers: [
    CharacterService,
    CreateCharacterUseCase,
    GetCharacterUseCase,
    UpdateCharacterUseCase,
    DeleteCharacterUseCase,
    {
      provide: CHARACTER_REPOSITORY_TOKEN,
      useClass: InMemoryCharacterRepository,
    },
  ],
  exports: [CharacterService, CHARACTER_REPOSITORY_TOKEN],
})
export class CharacterModule {}