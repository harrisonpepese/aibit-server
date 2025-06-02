import { Inject, Injectable } from '@nestjs/common';
import { Character } from '../../domain/entities/character.entity';
import { CharacterRepository } from '../../domain/repositories/character.repository';
import { CHARACTER_REPOSITORY_TOKEN } from '../../domain/repositories/character.repository.token';
import { CharacterName } from '../../domain/value-objects/character-name.vo';

export interface CreateCharacterRequest {
  accountId: string;
  name: string;
}

@Injectable()
export class CreateCharacterUseCase {
  constructor(
    @Inject(CHARACTER_REPOSITORY_TOKEN)
    private readonly characterRepository: CharacterRepository,
  ) {}

  async execute(request: CreateCharacterRequest): Promise<Character> {
    const { accountId, name } = request;

    // Validar nome usando Value Object
    const characterName = new CharacterName(name);

    // Verificar se já existe um personagem com esse nome
    const existingCharacter = await this.characterRepository.findByName(characterName.getValue());
    if (existingCharacter) {
      throw new Error('Já existe um personagem com esse nome');
    }

    // Verificar se a conta já tem o máximo de personagens permitidos
    const accountCharacters = await this.characterRepository.findByAccountId(accountId);
    const maxCharactersPerAccount = 5; // Limite configurável
    
    if (accountCharacters.length >= maxCharactersPerAccount) {
      throw new Error('Número máximo de personagens por conta atingido');
    }

    // Criar novo personagem
    const character = new Character(accountId, characterName.getValue());

    // Salvar no repositório
    return await this.characterRepository.save(character);
  }
}
