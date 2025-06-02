import { Injectable } from '@nestjs/common';
import { MovementEvent, MovementEventType } from '../../domain/entities/movement-event.entity';
import { MovementType, MovementSource, Position } from '../../domain/entities/movement.entity';
import { MovementEventProcessor } from '../../infrastructure/services/movement-event-processor.service';
import { MovingEntitiesTrackingService } from '../../infrastructure/services/moving-entities-tracking.service';

@Injectable()
export class RequestMovementUseCase {
  constructor(
    private readonly movementEventProcessor: MovementEventProcessor,
    private readonly entityTrackingService: MovingEntitiesTrackingService,
  ) {}

  async execute(
    entityId: string,
    fromPosition: Position,
    toPosition: Position,
    movementType: MovementType,
    source: MovementSource,
    speed: number = 1.0,
  ): Promise<MovementEvent> {
    // Verifica se a entidade já está em movimento
    const isAlreadyMoving = this.entityTrackingService.isEntityMoving(entityId);
    
    // Criar evento de requisição de movimento
    const movementEvent = new MovementEvent(
      MovementEventType.REQUEST_MOVEMENT,
      {
        movementRequest: {
          entityId,
          fromPosition,
          toPosition,
          movementType,
          source,
          speed,
        },
      },
      [entityId],
      // Prioridade: teleporte > knockback > outros movimentos
      movementType === MovementType.TELEPORT ? 10 : 
      movementType === MovementType.KNOCKBACK ? 5 : 
      isAlreadyMoving ? 2 : 0
    );

    // Adicionar evento à fila de processamento
    await this.movementEventProcessor.addEvent(movementEvent);

    return movementEvent;
  }
}
