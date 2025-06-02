import { Injectable } from '@nestjs/common';
import { MovementEvent, MovementEventType } from '../../domain/entities/movement-event.entity';
import { MovementEventProcessor } from '../../infrastructure/services/movement-event-processor.service';
import { MovingEntitiesTrackingService } from '../../infrastructure/services/moving-entities-tracking.service';

@Injectable()
export class CancelMovementUseCase {
  constructor(
    private readonly movementEventProcessor: MovementEventProcessor,
    private readonly entityTrackingService: MovingEntitiesTrackingService,
  ) {}

  async execute(
    entityId: string,
    reason: string = 'Cancelled by request',
  ): Promise<MovementEvent> {
    // Verificar se a entidade está em movimento
    const isMoving = this.entityTrackingService.isEntityMoving(entityId);
    
    if (!isMoving) {
      throw new Error(`Entidade ${entityId} não está em movimento para ser cancelada`);
    }
    
    // Criar evento para cancelar o movimento
    const cancelEvent = new MovementEvent(
      MovementEventType.CANCEL_MOVEMENT,
      {
        cancel: {
          reason,
        },
      },
      [entityId],
      8 // Alta prioridade para cancelamento
    );

    // Adicionar evento à fila de processamento
    await this.movementEventProcessor.addEvent(cancelEvent);

    return cancelEvent;
  }
}
