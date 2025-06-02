import { Injectable } from '@nestjs/common';
import { CombatEvent, CombatEventType } from '../../domain/entities/combat-event.entity';
import { AttackType, DamageType } from '../../domain/entities/attack.entity';
import { CombatEventProcessor } from '../../infrastructure/services/combat-event-processor.service';
import { CombatActiveParticipantsService } from '../../infrastructure/services/combat-active-participants.service';

@Injectable()
export class StartAttackUseCase {
  constructor(
    private readonly combatEventProcessor: CombatEventProcessor,
    private readonly activeParticipantsService: CombatActiveParticipantsService,
  ) {}

  async execute(
    attackerId: string,
    targetId: string,
    attackType: AttackType,
    damageType: DamageType,
    baseDamage: number,
    targetDodgeChance: number = 0,
    targetBlockChance: number = 0,
    targetResistance: number = 0,
    criticalChance: number = 0.05,
    accuracy: number = 0.9,
  ): Promise<CombatEvent> {
    // Verificar se os participantes já estão em combate
    const attackerIsActive = this.activeParticipantsService.isParticipantActive(attackerId);
    const targetIsActive = this.activeParticipantsService.isParticipantActive(targetId);

    // Criar evento de ataque
    const attackEvent = new CombatEvent(
      CombatEventType.ATTACK,
      {
        attack: {
          attackerId,
          targetId,
          attackType,
          damageType,
          baseDamage,
          targetDodgeChance,
          targetBlockChance,
          targetResistance,
          criticalChance,
          accuracy,
        },
      },
      [attackerId, targetId],
      // Se algum dos participantes já está em combate, dar maior prioridade
      (attackerIsActive || targetIsActive) ? 1 : 0,
    );

    // Adicionar evento à fila de processamento
    await this.combatEventProcessor.addEvent(attackEvent);

    return attackEvent;
  }
}
