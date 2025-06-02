import { Module } from '@nestjs/common';
import { MovementController } from './movement.controller';
import { MovementService } from './movement.service';

// Use Cases
import { ExecuteMovementUseCase } from './application/use-cases/execute-movement.use-case';
import { GetMovementHistoryUseCase } from './application/use-cases/get-movement-history.use-case';
import { GetMovementStatisticsUseCase } from './application/use-cases/get-movement-statistics.use-case';
import { DeleteMovementUseCase } from './application/use-cases/delete-movement.use-case';

// Repository
import { InMemoryMovementRepository } from './infrastructure/repositories/in-memory-movement.repository';
import { MOVEMENT_REPOSITORY_TOKEN } from './domain/repositories/movement.repository.token';

@Module({
  controllers: [MovementController],
  providers: [
    MovementService,
    
    // Use Cases
    ExecuteMovementUseCase,
    GetMovementHistoryUseCase,
    GetMovementStatisticsUseCase,
    DeleteMovementUseCase,
    
    // Repository
    {
      provide: MOVEMENT_REPOSITORY_TOKEN,
      useClass: InMemoryMovementRepository,
    },
  ],
  exports: [
    MovementService,
    MOVEMENT_REPOSITORY_TOKEN,
  ],
})
export class MovementModule {}