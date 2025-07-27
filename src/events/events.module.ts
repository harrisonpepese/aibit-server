import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

// Use Cases
import { PublishEventUseCase } from './application/use-cases/publish-event.use-case';
import { GetEventsUseCase } from './application/use-cases/get-events.use-case';
import { SubscribeToEventsUseCase } from './application/use-cases/subscribe-to-events.use-case';
import { CleanupEventsUseCase } from './application/use-cases/cleanup-events.use-case';

// Infrastructure Services
import { EventProcessorService } from './infrastructure/services/event-processor.service';
import { EventQueueService } from './infrastructure/services/event-queue.service';
import { EventDispatcherService } from './infrastructure/services/event-dispatcher.service';

// Repository
import { InMemoryEventRepository } from './infrastructure/repositories/in-memory-event.repository';
import { EVENT_REPOSITORY } from './domain/repositories/event.repository.token';

@Module({
  controllers: [EventsController],
  providers: [
    // Main Service
    EventsService,
    
    // Use Cases
    PublishEventUseCase,
    GetEventsUseCase,
    SubscribeToEventsUseCase,
    CleanupEventsUseCase,
    
    // Infrastructure Services
    EventProcessorService,
    EventQueueService,
    EventDispatcherService,
    
    // Repository
    {
      provide: EVENT_REPOSITORY,
      useClass: InMemoryEventRepository,
    },
  ],
  exports: [
    EventsService, 
    EventDispatcherService
  ], // Export EventsService for use in other modules
})
export class EventsModule {}