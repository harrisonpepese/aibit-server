import { Injectable } from '@nestjs/common';
import { CombatEvent, CombatEventType } from '../../domain/entities/combat-event.entity';
import { CombatEventProcessor } from '../../infrastructure/services/combat-event-processor.service';
import { CombatActiveParticipantsService } from '../../infrastructure/services/combat-active-participants.service';

@Injectable()
export class EndCombatUseCase {
  constructor(
    private readonly combatEventProcessor: CombatEventProcessor,
    private readonly activeParticipantsService: CombatActiveParticipantsService,
  ) {}

  async execute(
    participantId: string,
    reason: string = 'Combate finalizado pelo participante',
  ): Promise<CombatEvent> {
    // Verifica se o participante está em combate
    if (!this.activeParticipantsService.isParticipantActive(participantId)) {
      throw new Error(`Participante ${participantId} não está em combate ativo`);
    }

    // Criar evento para finalizar o combate
    const endCombatEvent = new CombatEvent(
      CombatEventType.END_COMBAT,
      {
        endCombat: {
          reason,
        },
      },
      [participantId],
      // Finalizar combate tem alta prioridade
      10,
    );

    // Adicionar evento à fila de processamento
    await this.combatEventProcessor.addEvent(endCombatEvent);

    return endCombatEvent;
  }
}
