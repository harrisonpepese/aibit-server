import { Injectable } from '@nestjs/common';
import { CombatActiveParticipantsService } from '../../infrastructure/services/combat-active-participants.service';
import { CombatQueueService } from '../../infrastructure/services/combat-queue.service';

@Injectable()
export class GetCombatStatusUseCase {
  constructor(
    private readonly activeParticipantsService: CombatActiveParticipantsService,
    private readonly combatQueueService: CombatQueueService,
  ) {}

  async execute(participantId: string): Promise<any> {
    // Verifica se o participante está em combate
    const isActive = this.activeParticipantsService.isParticipantActive(participantId);
    
    if (!isActive) {
      return {
        inCombat: false,
      };
    }
    
    // Obter eventos pendentes para o participante
    const pendingEvents = this.combatQueueService.getPendingEventsForParticipant(participantId);
    
    return {
      inCombat: true,
      pendingEvents: pendingEvents.map(event => event.toJSON()),
    };
  }
}
