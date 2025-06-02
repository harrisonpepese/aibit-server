import { Injectable } from '@nestjs/common';
import { CombatEvent, CombatEventType } from '../../domain/entities/combat-event.entity';
import { CombatEffect } from '../../domain/value-objects/combat-effect.vo';
import { CombatEventProcessor } from '../../infrastructure/services/combat-event-processor.service';

@Injectable()
export class ApplyEffectUseCase {
  constructor(
    private readonly combatEventProcessor: CombatEventProcessor,
  ) {}

  async execute(
    effect: CombatEffect,
  ): Promise<CombatEvent> {
    // Criar evento para aplicar o efeito
    const applyEffectEvent = new CombatEvent(
      CombatEventType.APPLY_EFFECT,
      {
        effect: {
          effect,
        },
      },
      [effect.getSource(), effect.getTarget()],
      // Efeitos têm prioridade menor que ataques
      -1,
    );

    // Adicionar evento à fila de processamento
    await this.combatEventProcessor.addEvent(applyEffectEvent);

    return applyEffectEvent;
  }
}
