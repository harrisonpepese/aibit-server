import { Inject, Injectable } from '@nestjs/common';
import { MovementRepository } from '../../domain/repositories/movement.repository';
import { MOVEMENT_REPOSITORY_TOKEN } from '../../domain/repositories/movement.repository.token';

@Injectable()
export class DeleteMovementUseCase {
  constructor(
    @Inject(MOVEMENT_REPOSITORY_TOKEN)
    private readonly movementRepository: MovementRepository,
  ) {}

  async deleteById(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID do movimento é obrigatório');
    }

    // Verificar se o movimento existe antes de deletar
    const movement = await this.movementRepository.findById(id);
    if (!movement) {
      throw new Error('Movimento não encontrado');
    }

    await this.movementRepository.delete(id);
  }

  async deleteOldMovements(olderThanDays: number): Promise<number> {
    if (olderThanDays <= 0) {
      throw new Error('Número de dias deve ser positivo');
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const allMovements = await this.movementRepository.findAll();
    const oldMovements = allMovements.filter(m => m.getTimestamp() < cutoffDate);

    let deletedCount = 0;
    for (const movement of oldMovements) {
      await this.movementRepository.delete(movement.getId());
      deletedCount++;
    }

    return deletedCount;
  }

  async deleteMovementsByEntity(entityId: string): Promise<number> {
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    const movements = await this.movementRepository.findByEntityId(entityId);
    
    let deletedCount = 0;
    for (const movement of movements) {
      await this.movementRepository.delete(movement.getId());
      deletedCount++;
    }

    return deletedCount;
  }
}
