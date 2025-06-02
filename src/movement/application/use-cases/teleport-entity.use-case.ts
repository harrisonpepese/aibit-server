import { Injectable } from '@nestjs/common';
import { MovementEvent, MovementEventType } from '../../domain/entities/movement-event.entity';
import { Position } from '../../domain/entities/movement.entity';
import { MovementEventProcessor } from '../../infrastructure/services/movement-event-processor.service';
import { MovingEntitiesTrackingService } from '../../infrastructure/services/moving-entities-tracking.service';

@Injectable()
export class TeleportEntityUseCase {
  constructor(
    private readonly movementEventProcessor: MovementEventProcessor,
    private readonly entityTrackingService: MovingEntitiesTrackingService,
  ) {}

  async execute(
    entityId: string,
    targetPosition: Position,
    sourceEntityId: string,
    sourceName: string = 'System',
  ): Promise<MovementEvent> {
    // Obter a posição atual da entidade
    const currentPosition = this.entityTrackingService.getEntityPosition(entityId);
    
    if (!currentPosition) {
      throw new Error(`Entidade ${entityId} não encontrada ou posição desconhecida`);
    }
    
    // Criar evento de teleporte
    const teleportEvent = new MovementEvent(
      MovementEventType.TELEPORT,
      {
        teleport: {
          entityId,
          fromPosition: currentPosition,
          toPosition: targetPosition,
          source: {
            entityId: sourceEntityId,
            entityName: sourceName,
            entityType: 'system',
          },
        },
      },
      [entityId],
      10 // Prioridade máxima para teleportes
    );

    // Adicionar evento à fila de processamento
    await this.movementEventProcessor.addEvent(teleportEvent);

    return teleportEvent;
  }
}
