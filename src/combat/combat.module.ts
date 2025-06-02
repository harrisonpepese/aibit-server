import { Module } from '@nestjs/common';
import { CombatController } from './combat.controller';
import { CombatService } from './combat.service';
import { StartAttackUseCase } from './application/use-cases/start-attack.use-case';
import { EndCombatUseCase } from './application/use-cases/end-combat.use-case';
import { GetCombatStatusUseCase } from './application/use-cases/get-combat-status.use-case';
import { ApplyEffectUseCase } from './application/use-cases/apply-effect.use-case';
import { CombatQueueService } from './infrastructure/services/combat-queue.service';
import { CombatEventProcessor } from './infrastructure/services/combat-event-processor.service';
import { CombatActiveParticipantsService } from './infrastructure/services/combat-active-participants.service';
import { InMemoryCombatRepository } from './infrastructure/repositories/in-memory-combat.repository';
import { COMBAT_REPOSITORY } from './domain/repositories/combat.repository.token';

@Module({
  controllers: [CombatController],
  providers: [
    CombatService,
    StartAttackUseCase,
    EndCombatUseCase,
    GetCombatStatusUseCase,
    ApplyEffectUseCase,
    CombatQueueService,
    CombatEventProcessor,
    CombatActiveParticipantsService,
    {
      provide: COMBAT_REPOSITORY,
      useClass: InMemoryCombatRepository,
    },
  ],
  exports: [CombatService],
})
export class CombatModule {}