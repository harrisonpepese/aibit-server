import { Inject, Injectable } from '@nestjs/common';
import { DamageRepository } from '../../domain/repositories/damage.repository';
import { DAMAGE_REPOSITORY_TOKEN } from '../../domain/repositories/damage.repository.token';
import { Damage, DamageType } from '../../domain/entities/damage.entity';

export interface DamageStatistics {
  totalDamageDealt: number;
  totalDamageReceived: number;
  damageByType: Record<DamageType, number>;
  criticalHits: number;
  totalHits: number;
  criticalRate: number;
  averageDamage: number;
  highestDamage: number;
  mostUsedDamageType: DamageType;
}

@Injectable()
export class GetDamageStatisticsUseCase {
  constructor(
    @Inject(DAMAGE_REPOSITORY_TOKEN)
    private readonly damageRepository: DamageRepository,
  ) {}

  async getStatisticsForEntity(entityId: string): Promise<DamageStatistics> {
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    // Buscar danos causados e recebidos
    const [damageDealt, damageReceived] = await Promise.all([
      this.damageRepository.findBySourceId(entityId),
      this.damageRepository.findByTargetId(entityId),
    ]);

    return this.calculateStatistics(damageDealt, damageReceived);
  }

  async getRecentStatistics(
    entityId: string, 
    minutes: number = 60,
  ): Promise<DamageStatistics> {
    if (!entityId || entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    if (minutes <= 0) {
      throw new Error('Quantidade de minutos deve ser positiva');
    }

    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - minutes * 60 * 1000);

    // Buscar danos no período especificado
    const allDamage = await this.damageRepository.findByTimeRange(startTime, endTime);
    
    const damageDealt = allDamage.filter(d => d.getSource().sourceId === entityId);
    const damageReceived = allDamage.filter(d => 
      // Aqui assumimos que temos uma forma de identificar o alvo
      // Isso pode precisar ser ajustado baseado na implementação final
      false // TODO: implementar lógica para identificar dano recebido
    );

    return this.calculateStatistics(damageDealt, damageReceived);
  }

  private calculateStatistics(
    damageDealt: Damage[], 
    damageReceived: Damage[],
  ): DamageStatistics {
    const allDamage = [...damageDealt, ...damageReceived];
    
    if (allDamage.length === 0) {
      return this.getEmptyStatistics();
    }

    // Calcular totais
    const totalDamageDealt = damageDealt.reduce((sum, d) => sum + d.getAmount(), 0);
    const totalDamageReceived = damageReceived.reduce((sum, d) => sum + d.getAmount(), 0);

    // Calcular dano por tipo (apenas dano causado)
    const damageByType = this.calculateDamageByType(damageDealt);

    // Calcular estatísticas de crítico
    const criticalHits = damageDealt.filter(d => d.getIsCritical()).length;
    const totalHits = damageDealt.length;
    const criticalRate = totalHits > 0 ? (criticalHits / totalHits) * 100 : 0;

    // Calcular médias e máximos
    const averageDamage = totalHits > 0 ? totalDamageDealt / totalHits : 0;
    const highestDamage = damageDealt.length > 0 
      ? Math.max(...damageDealt.map(d => d.getAmount())) 
      : 0;

    // Encontrar tipo de dano mais usado
    const mostUsedDamageType = this.getMostUsedDamageType(damageByType);

    return {
      totalDamageDealt,
      totalDamageReceived,
      damageByType,
      criticalHits,
      totalHits,
      criticalRate: Math.round(criticalRate * 100) / 100,
      averageDamage: Math.round(averageDamage * 100) / 100,
      highestDamage,
      mostUsedDamageType,
    };
  }

  private calculateDamageByType(damages: Damage[]): Record<DamageType, number> {
    const result = {} as Record<DamageType, number>;
    
    // Inicializar todos os tipos com 0
    Object.values(DamageType).forEach(type => {
      result[type] = 0;
    });

    // Somar dano por tipo
    damages.forEach(damage => {
      result[damage.getType()] += damage.getAmount();
    });

    return result;
  }

  private getMostUsedDamageType(damageByType: Record<DamageType, number>): DamageType {
    let maxDamage = 0;
    let mostUsedType = DamageType.PHYSICAL;

    Object.entries(damageByType).forEach(([type, damage]) => {
      if (damage > maxDamage) {
        maxDamage = damage;
        mostUsedType = type as DamageType;
      }
    });

    return mostUsedType;
  }

  private getEmptyStatistics(): DamageStatistics {
    const damageByType = {} as Record<DamageType, number>;
    Object.values(DamageType).forEach(type => {
      damageByType[type] = 0;
    });

    return {
      totalDamageDealt: 0,
      totalDamageReceived: 0,
      damageByType,
      criticalHits: 0,
      totalHits: 0,
      criticalRate: 0,
      averageDamage: 0,
      highestDamage: 0,
      mostUsedDamageType: DamageType.PHYSICAL,
    };
  }
}
