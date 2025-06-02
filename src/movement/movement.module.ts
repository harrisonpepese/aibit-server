import { Module } from '@nestjs/common';
import { MovementController } from './movement.controller';
import { MovementService } from './movement.service';

// Legacy Use Cases
import { ExecuteMovementUseCase } from './application/use-cases/execute-movement.use-case';
import { GetMovementHistoryUseCase } from './application/use-cases/get-movement-history.use-case';
import { GetMovementStatisticsUseCase } from './application/use-cases/get-movement-statistics.use-case';
import { DeleteMovementUseCase } from './application/use-cases/delete-movement.use-case';

// New Event-Based Use Cases
import { RequestMovementUseCase } from './application/use-cases/request-movement.use-case';
import { TeleportEntityUseCase } from './application/use-cases/teleport-entity.use-case';
import { CancelMovementUseCase } from './application/use-cases/cancel-movement.use-case';
import { GetMovementStatusUseCase } from './application/use-cases/get-movement-status.use-case';

// Repository
import { InMemoryMovementRepository } from './infrastructure/repositories/in-memory-movement.repository';
import { MOVEMENT_REPOSITORY_TOKEN } from './domain/repositories/movement.repository.token';

// Infrastructure Services
import { MovementQueueService } from './infrastructure/services/movement-queue.service';
import { MovingEntitiesTrackingService } from './infrastructure/services/moving-entities-tracking.service';
import { MovementEventProcessor } from './infrastructure/services/movement-event-processor.service';

@Module({
  controllers: [MovementController],
  providers: [
    MovementService,
    
    // Legacy Use Cases
    ExecuteMovementUseCase,
    GetMovementHistoryUseCase,
    GetMovementStatisticsUseCase,
    DeleteMovementUseCase,
    
    // New Event-Based Use Cases
    RequestMovementUseCase,
    TeleportEntityUseCase,
    CancelMovementUseCase,
    GetMovementStatusUseCase,
      // Infrastructure Services
    MovementQueueService,
    MovingEntitiesTrackingService,
    MovementEventProcessor,
    
    // Repository
    {
      provide: MOVEMENT_REPOSITORY_TOKEN,
      useClass: InMemoryMovementRepository,
    },
  ],
  exports: [
    MovementService,
    MOVEMENT_REPOSITORY_TOKEN,
    MovingEntitiesTrackingService, // Export for other modules that need position data
  ],
})
export class MovementModule {}