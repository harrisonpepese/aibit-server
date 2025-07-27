import { Injectable } from '@nestjs/common';
import { CreateCharacterUseCase } from './application/use-cases/create-character.use-case';
import { GetCharacterUseCase } from './application/use-cases/get-character.use-case';
import { DeleteCharacterUseCase } from './application/use-cases/delete-character.use-case';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterStatsDto } from './dto/update-character-stats.dto';
import { UpdateCharacterPositionDto } from './dto/update-character-position.dto';
import { CharacterResponseDto } from './dto/character-response.dto';
import { Character } from './domain/entities/character.entity';

@Injectable()
export class CharacterService {
  constructor(
    private readonly createCharacterUseCase: CreateCharacterUseCase,
    private readonly getCharacterUseCase: GetCharacterUseCase,
    private readonly deleteCharacterUseCase: DeleteCharacterUseCase,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<CharacterResponseDto> {
    const character = await this.createCharacterUseCase.execute(createCharacterDto);
    return new CharacterResponseDto(character);
  }

  async findAll(): Promise<CharacterResponseDto[]> {
    const characters = await this.getCharacterUseCase.all();
    return characters.map(character => new CharacterResponseDto(character));
  }

  async findOne(id: string): Promise<CharacterResponseDto> {
    const character = await this.getCharacterUseCase.byId(id);
    return new CharacterResponseDto(character);
  }

  async findByName(name: string): Promise<CharacterResponseDto> {
    const character = await this.getCharacterUseCase.byName(name);
    return new CharacterResponseDto(character);
  }

  async findByAccountId(accountId: string): Promise<CharacterResponseDto[]> {
    const characters = await this.getCharacterUseCase.byAccountId(accountId);
    return characters.map(character => new CharacterResponseDto(character));
  }

  async findOnlineCharacters(): Promise<CharacterResponseDto[]> {
    const characters = await this.getCharacterUseCase.onlineCharacters();
    return characters.map(character => new CharacterResponseDto(character));
  }

  async remove(id: string, accountId: string): Promise<void> {
    await this.deleteCharacterUseCase.execute(id, accountId);
  }
}