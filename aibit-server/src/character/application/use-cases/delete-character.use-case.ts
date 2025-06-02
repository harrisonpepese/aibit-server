import { Inject, Injectable } from '@nestjs/common';
import { CharacterRepository } from '../../domain/repositories/character.repository';
import { CHARACTER_REPOSITORY_TOKEN } from '../../domain/repositories/character.repository.token';

@Injectable()
export class DeleteCharacterUseCase {
  constructor(
    @Inject(CHARACTER_REPOSITORY_TOKEN)
    private readonly characterRepository: CharacterRepository,
  ) {}

  async execute(characterId: string, accountId: string): Promise<void> {
    if (!characterId || characterId.trim().length === 0) {
      throw new Error('ID do personagem é obrigatório');
    }

    if (!accountId || accountId.trim().length === 0) {
      throw new Error('ID da conta é obrigatório');
    }

    const character = await this.characterRepository.findById(characterId);
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Verificar se o personagem pertence à conta
    if (character.accountId !== accountId) {
      throw new Error('Você não tem permissão para deletar este personagem');
    }

    // Verificar se o personagem está online
    if (character.getIsOnline()) {
      throw new Error('Não é possível deletar um personagem que está online');
    }

    await this.characterRepository.delete(characterId);
  }
}
