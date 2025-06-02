import { Inject, Injectable } from '@nestjs/common';
import { Character } from '../../domain/entities/character.entity';
import { CharacterRepository } from '../../domain/repositories/character.repository';
import { CHARACTER_REPOSITORY_TOKEN } from '../../domain/repositories/character.repository.token';

@Injectable()
export class GetCharacterUseCase {
  constructor(
    @Inject(CHARACTER_REPOSITORY_TOKEN)
    private readonly characterRepository: CharacterRepository,
  ) {}

  async byId(id: string): Promise<Character> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID do personagem é obrigatório');
    }

    const character = await this.characterRepository.findById(id);
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    return character;
  }

  async byName(name: string): Promise<Character> {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome do personagem é obrigatório');
    }

    const character = await this.characterRepository.findByName(name);
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    return character;
  }

  async byAccountId(accountId: string): Promise<Character[]> {
    if (!accountId || accountId.trim().length === 0) {
      throw new Error('ID da conta é obrigatório');
    }

    return await this.characterRepository.findByAccountId(accountId);
  }

  async all(): Promise<Character[]> {
    return await this.characterRepository.findAll();
  }

  async onlineCharacters(): Promise<Character[]> {
    return await this.characterRepository.findOnlineCharacters();
  }
}
