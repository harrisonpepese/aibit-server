import { Inject, Injectable } from '@nestjs/common';
import { DamageRepository } from '../../domain/repositories/damage.repository';
import { DAMAGE_REPOSITORY_TOKEN } from '../../domain/repositories/damage.repository.token';
import { Damage } from '../../domain/entities/damage.entity';

@Injectable()
export class GetDamageHistoryUseCase {
  constructor(
    @Inject(DAMAGE_REPOSITORY_TOKEN)
    private readonly damageRepository: DamageRepository,
  ) {}

  async getDamageDealtBy(sourceId: string, limit?: number): Promise<Damage[]> {
    if (!sourceId || sourceId.trim().length === 0) {
      throw new Error('ID da fonte é obrigatório');
    }

    const damages = await this.damageRepository.findBySourceId(sourceId);
    
    // Ordenar por timestamp decrescente (mais recente primeiro)
    damages.sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());

    return limit ? damages.slice(0, limit) : damages;
  }

  async getDamageReceivedBy(targetId: string, limit?: number): Promise<Damage[]> {
    if (!targetId || targetId.trim().length === 0) {
      throw new Error('ID do alvo é obrigatório');
    }

    const damages = await this.damageRepository.findByTargetId(targetId);
    
    // Ordenar por timestamp decrescente (mais recente primeiro)
    damages.sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());

    return limit ? damages.slice(0, limit) : damages;
  }

  async getRecentDamage(targetId: string, minutes: number = 5): Promise<Damage[]> {
    if (!targetId || targetId.trim().length === 0) {
      throw new Error('ID do alvo é obrigatório');
    }

    if (minutes <= 0) {
      throw new Error('Quantidade de minutos deve ser positiva');
    }

    return await this.damageRepository.findRecentDamage(targetId, minutes);
  }

  async getDamageInTimeRange(
    startTime: Date, 
    endTime: Date, 
    entityId?: string,
  ): Promise<Damage[]> {
    if (startTime >= endTime) {
      throw new Error('Data de início deve ser anterior à data de fim');
    }

    const damages = await this.damageRepository.findByTimeRange(startTime, endTime);

    if (entityId) {
      // Filtrar por entidade específica (como fonte ou alvo)
      return damages.filter(d => 
        d.getSource().sourceId === entityId 
        // TODO: adicionar filtro por targetId quando disponível
      );
    }

    return damages;
  }

  async getDamageById(id: string): Promise<Damage> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID do dano é obrigatório');
    }

    const damage = await this.damageRepository.findById(id);
    if (!damage) {
      throw new Error('Dano não encontrado');
    }

    return damage;
  }
}
