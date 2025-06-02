import { Inject, Injectable } from '@nestjs/common';
import { DamageRepository } from '../../domain/repositories/damage.repository';
import { DAMAGE_REPOSITORY_TOKEN } from '../../domain/repositories/damage.repository.token';

@Injectable()
export class DeleteDamageUseCase {
  constructor(
    @Inject(DAMAGE_REPOSITORY_TOKEN)
    private readonly damageRepository: DamageRepository,
  ) {}

  async deleteDamage(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID do dano é obrigatório');
    }

    // Verificar se o dano existe
    const damage = await this.damageRepository.findById(id);
    if (!damage) {
      throw new Error('Dano não encontrado');
    }

    await this.damageRepository.delete(id);
  }

  async deleteOldDamage(olderThanDays: number): Promise<void> {
    if (olderThanDays <= 0) {
      throw new Error('Número de dias deve ser positivo');
    }

    if (olderThanDays > 365) {
      throw new Error('Não é possível deletar dados com mais de 365 dias de uma vez');
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    await this.damageRepository.deleteOlderThan(cutoffDate);
  }

  async deleteByEntity(entityId: string): Promise<void> {
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    // Buscar todos os danos relacionados à entidade
    const [damageDealt, damageReceived] = await Promise.all([
      this.damageRepository.findBySourceId(entityId),
      this.damageRepository.findByTargetId(entityId),
    ]);

    // Deletar todos os danos
    const allDamages = [...damageDealt, ...damageReceived];
    const uniqueDamages = Array.from(new Set(allDamages.map(d => d.getId())));

    for (const damageId of uniqueDamages) {
      await this.damageRepository.delete(damageId);
    }
  }
}
