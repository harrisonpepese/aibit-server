import { Inject, Injectable } from '@nestjs/common';
import { 
  Damage, 
  DamageType, 
  DamageSource, 
  StatusEffectData, 
  DamageResistance,
  DamageCalculationResult 
} from '../../domain/entities/damage.entity';
import { DamageRepository } from '../../domain/repositories/damage.repository';
import { DAMAGE_REPOSITORY_TOKEN } from '../../domain/repositories/damage.repository.token';

export interface ApplyDamageRequest {
  targetId: string;
  amount: number;
  type: DamageType;
  source: DamageSource;
  isCritical?: boolean;
  statusEffects?: StatusEffectData[];
  targetResistances?: DamageResistance[];
  targetArmor?: number;
}

export interface ApplyDamageResult {
  damage: Damage;
  calculationResult: DamageCalculationResult;
  targetId: string;
}

@Injectable()
export class ApplyDamageUseCase {
  constructor(
    @Inject(DAMAGE_REPOSITORY_TOKEN)
    private readonly damageRepository: DamageRepository,
  ) {}

  async execute(request: ApplyDamageRequest): Promise<ApplyDamageResult> {
    const {
      targetId,
      amount,
      type,
      source,
      isCritical = false,
      statusEffects = [],
      targetResistances = [],
      targetArmor = 0,
    } = request;

    // Validar entrada
    this.validateRequest(request);

    // Criar instância de dano
    const damage = new Damage(
      amount,
      type,
      source,
      isCritical,
      statusEffects,
    );

    // Calcular dano final considerando resistências e armadura
    const calculationResult = damage.calculateFinalDamage(
      targetResistances,
      targetArmor,
    );

    // Salvar registro de dano
    await this.damageRepository.save(damage);

    return {
      damage,
      calculationResult,
      targetId,
    };
  }

  private validateRequest(request: ApplyDamageRequest): void {
    if (!request.targetId || request.targetId.trim().length === 0) {
      throw new Error('ID do alvo é obrigatório');
    }

    if (request.amount < 0) {
      throw new Error('Quantidade de dano não pode ser negativa');
    }

    if (!Object.values(DamageType).includes(request.type)) {
      throw new Error('Tipo de dano inválido');
    }

    if (!request.source || !request.source.sourceId) {
      throw new Error('Fonte do dano é obrigatória');
    }

    // Validar resistências se fornecidas
    if (request.targetResistances) {
      for (const resistance of request.targetResistances) {
        if (resistance.percentage < 0 || resistance.percentage > 200) {
          throw new Error('Percentual de resistência deve estar entre 0 e 200');
        }
      }
    }

    // Validar armadura se fornecida
    if (request.targetArmor !== undefined && request.targetArmor < 0) {
      throw new Error('Valor de armadura não pode ser negativo');
    }
  }
}
