import { Injectable } from '@nestjs/common';
import { MovingEntitiesTrackingService } from '../../infrastructure/services/moving-entities-tracking.service';
import { MovementQueueService } from '../../infrastructure/services/movement-queue.service';

@Injectable()
export class GetMovementStatusUseCase {
  constructor(
    private readonly entityTrackingService: MovingEntitiesTrackingService,
    private readonly movementQueueService: MovementQueueService,
  ) {}

  async execute(entityId: string): Promise<any> {
    // Obter o estado atual da entidade
    const entityState = this.entityTrackingService.getEntityMovementState(entityId);
    
    // Obter eventos pendentes para a entidade
    const pendingEvents = this.movementQueueService.getPendingEventsForEntity(entityId);
    
    return {
      entityId,
      isMoving: entityState?.isMoving || false,
      currentPosition: entityState?.currentPosition || null,
      targetPosition: entityState?.targetPosition || null,
      lastMoveTime: entityState?.lastMoveTime || null,
      speed: entityState?.speed || 0,
      pendingEvents: pendingEvents.map(event => event.toJSON()),
    };
  }
}
