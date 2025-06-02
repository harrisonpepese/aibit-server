import { Module } from '@nestjs/common';
import { DamageController } from './damage.controller';
import { DamageService } from './damage.service';
import { ApplyDamageUseCase } from './application/use-cases/apply-damage.use-case';
import { GetDamageStatisticsUseCase } from './application/use-cases/get-damage-statistics.use-case';
import { GetDamageHistoryUseCase } from './application/use-cases/get-damage-history.use-case';
import { DeleteDamageUseCase } from './application/use-cases/delete-damage.use-case';
import { DAMAGE_REPOSITORY_TOKEN } from './domain/repositories/damage.repository.token';
import { InMemoryDamageRepository } from './infrastructure/repositories/in-memory-damage.repository';

@Module({
  controllers: [DamageController],
  providers: [
    DamageService,
    ApplyDamageUseCase,
    GetDamageStatisticsUseCase,
    GetDamageHistoryUseCase,
    DeleteDamageUseCase,
    {
      provide: DAMAGE_REPOSITORY_TOKEN,
      useClass: InMemoryDamageRepository,
    },
  ],
  exports: [DamageService, DAMAGE_REPOSITORY_TOKEN],
})
export class DamageModule {}