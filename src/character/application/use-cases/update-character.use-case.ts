import { Inject, Injectable } from '@nestjs/common';
import { Character } from '../../domain/entities/character.entity';
import { CharacterRepository } from '../../domain/repositories/character.repository';
import { CHARACTER_REPOSITORY_TOKEN } from '../../domain/repositories/character.repository.token';

export interface UpdateCharacterStatsRequest {
  characterId: string;
  damage?: number;
  healing?: number;
  experience?: number;
}

export interface UpdateCharacterPositionRequest {
  characterId: string;
  x: number;
  y: number;
  z: number;
}

@Injectable()
export class UpdateCharacterUseCase {
  constructor(
    @Inject(CHARACTER_REPOSITORY_TOKEN)
    private readonly characterRepository: CharacterRepository,
  ) {}

  async updateStats(request: UpdateCharacterStatsRequest): Promise<Character> {
    const { characterId, damage, healing, experience } = request;

    const character = await this.characterRepository.findById(characterId);
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    if (damage !== undefined && damage > 0) {
      character.takeDamage(damage);
    }

    if (healing !== undefined && healing > 0) {
      character.heal(healing);
    }

    if (experience !== undefined && experience > 0) {
      const leveledUp = character.gainExperience(experience);
      if (leveledUp) {
        // Aqui poderia emitir um evento de level up
        console.log(`${character.name} subiu para o nível ${character.getStats().level}!`);
      }
    }

    return await this.characterRepository.update(character);
  }

  async updatePosition(request: UpdateCharacterPositionRequest): Promise<Character> {
    const { characterId, x, y, z } = request;

    const character = await this.characterRepository.findById(characterId);
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    character.moveTo({ x, y, z });
    return await this.characterRepository.update(character);
  }

  async setOnlineStatus(characterId: string, isOnline: boolean): Promise<Character> {
    const character = await this.characterRepository.findById(characterId);
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    character.setOnlineStatus(isOnline);
    return await this.characterRepository.update(character);
  }
}
