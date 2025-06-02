import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { 
  MovementEvent, 
  MovementEventType, 
  MovementEventStatus 
} from '../../domain/entities/movement-event.entity';
import { 
  Movement, 
  MovementType, 
  MovementStatus, 
  MovementResult 
} from '../../domain/entities/movement.entity';
import { MovementQueueService } from './movement-queue.service';
import { MovingEntitiesTrackingService } from './moving-entities-tracking.service';
import { MovementRepository } from '../../domain/repositories/movement.repository';
import { Inject } from '@nestjs/common';
import { MOVEMENT_REPOSITORY_TOKEN } from '../../domain/repositories/movement.repository.token';

@Injectable()
export class MovementEventProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly TURN_INTERVAL_MS = 100; // 100ms para movimentos (mais responsivo que o combate)
  private intervalId: NodeJS.Timeout | null = null;
  private processing = false;
  
  constructor(
    private readonly movementQueueService: MovementQueueService,
    private readonly entityTrackingService: MovingEntitiesTrackingService,
    @Inject(MOVEMENT_REPOSITORY_TOKEN)
    private readonly movementRepository: MovementRepository,
  ) {}

  onModuleInit() {
    // Inicia o processamento de eventos em ciclos regulares
    this.startProcessing();
  }

  onModuleDestroy() {
    // Para o processamento ao desligar o módulo
    this.stopProcessing();
  }

  startProcessing(): void {
    if (this.intervalId) {
      return; // Já está processando
    }

    this.intervalId = setInterval(() => this.processTurn(), this.TURN_INTERVAL_MS);
    console.log('[MovementEventProcessor] Iniciando processamento de eventos de movimento a cada 100ms');
  }

  stopProcessing(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[MovementEventProcessor] Processamento de eventos de movimento interrompido');
    }
  }

  // Processa um turno de movimento
  async processTurn(): Promise<void> {
    if (this.processing) {
      return; // Ainda processando o turno anterior
    }

    this.processing = true;
    try {
      // Obtém eventos pendentes
      const pendingEvents = this.movementQueueService.getPendingEvents();
      
      if (pendingEvents.length > 0) {
        console.log(`[MovementEventProcessor] Processando ${pendingEvents.length} eventos de movimento`);
      }
      
      // Processa cada evento
      for (const event of pendingEvents) {
        await this.processEvent(event);
      }
    } catch (error) {
      console.error('[MovementEventProcessor] Erro ao processar turno de movimento:', error);
    } finally {
      this.processing = false;
    }
  }

  // Adiciona um evento à fila para processamento
  async addEvent(event: MovementEvent): Promise<void> {
    this.movementQueueService.enqueue(event);
    
    // Se for um evento de requisição de movimento, registra a entidade como em movimento
    if (event.getType() === MovementEventType.REQUEST_MOVEMENT) {
      const data = event.getData().movementRequest;
      if (data) {
        this.entityTrackingService.startEntityMovement(
          data.entityId,
          data.fromPosition,
          data.toPosition,
          data.speed || 1.0
        );
      }
    }
  }

  // Processa um evento individual
  private async processEvent(event: MovementEvent): Promise<void> {
    event.markAsProcessing();
    
    try {
      switch (event.getType()) {
        case MovementEventType.REQUEST_MOVEMENT:
        case MovementEventType.PROCESS_MOVEMENT:
          await this.processMovementRequestEvent(event);
          break;
        case MovementEventType.TELEPORT:
          await this.processTeleportEvent(event);
          break;
        case MovementEventType.KNOCKBACK:
          await this.processKnockbackEvent(event);
          break;
        case MovementEventType.POSITION_UPDATE:
          await this.processPositionUpdateEvent(event);
          break;
        case MovementEventType.CANCEL_MOVEMENT:
          await this.processCancelMovementEvent(event);
          break;
        default:
          throw new Error(`Tipo de evento não suportado: ${event.getType()}`);
      }
    } catch (error) {
      console.error(`[MovementEventProcessor] Erro ao processar evento ${event.getType()}:`, error);
      event.fail(error);
    }
  }

  // Processa um evento de requisição de movimento
  private async processMovementRequestEvent(event: MovementEvent): Promise<void> {
    const movementData = event.getData().movementRequest;
    if (!movementData) {
      throw new Error('Dados de movimento ausentes no evento');
    }

    const {
      entityId,
      fromPosition,
      toPosition,
      movementType,
      source,
      speed = 1.0,
    } = movementData;

    // Verifica se o movimento é válido
    const validationResult = await this.validateMovement(entityId, fromPosition, toPosition, movementType);
    
    if (!validationResult.isValid) {
      this.entityTrackingService.finishEntityMovement(entityId);
      
      event.complete({
        status: MovementStatus.BLOCKED,
        reason: validationResult.reason,
        actualPosition: fromPosition,
      });
      
      return;
    }

    // Criar um novo movimento
    let movement: Movement;
    
    switch (movementType) {
      case MovementType.WALK:
        movement = Movement.createWalk(entityId, fromPosition, toPosition, source, speed);
        break;
      case MovementType.RUN:
        movement = Movement.createRun(entityId, fromPosition, toPosition, source, speed);
        break;
      case MovementType.TELEPORT:
        movement = Movement.createTeleport(entityId, fromPosition, toPosition, source);
        break;
      case MovementType.KNOCKBACK:
        movement = Movement.createKnockback(entityId, fromPosition, toPosition, source);
        break;
      default:
        movement = new Movement(entityId, fromPosition, toPosition, movementType, source, speed);
    }

    // Salvar o movimento
    const savedMovement = await this.movementRepository.save(movement);

    // Atualizar a posição da entidade
    this.entityTrackingService.updateEntityPosition(entityId, toPosition);
    
    // Se não for teleporte (que é instantâneo), considerar a entidade como não mais em movimento
    if (movementType !== MovementType.TELEPORT) {
      this.entityTrackingService.finishEntityMovement(entityId, toPosition);
    }

    // Preparar o resultado
    const result: MovementResult = {
      movement: savedMovement,
      status: MovementStatus.SUCCESS,
      actualPosition: toPosition,
      staminaCost: movement.getStaminaCost(),
      duration: movement.getDuration(),
      collisions: [],
    };

    // Completar o evento
    event.complete(result);
  }

  // Processa um evento de teleporte
  private async processTeleportEvent(event: MovementEvent): Promise<void> {
    const teleportData = event.getData().teleport;
    if (!teleportData) {
      throw new Error('Dados de teleporte ausentes no evento');
    }

    const { entityId, fromPosition, toPosition, source } = teleportData;

    // Criar um movimento de teleporte
    const movement = Movement.createTeleport(entityId, fromPosition, toPosition, source);

    // Salvar o movimento
    const savedMovement = await this.movementRepository.save(movement);

    // Atualizar a posição da entidade (teleporte é instantâneo)
    this.entityTrackingService.updateEntityPosition(entityId, toPosition);
    this.entityTrackingService.finishEntityMovement(entityId, toPosition);

    // Completar o evento
    event.complete({
      movement: savedMovement,
      status: MovementStatus.SUCCESS,
      actualPosition: toPosition,
      staminaCost: 0,
      duration: 0,
      collisions: [],
    });
  }

  // Processa um evento de knockback
  private async processKnockbackEvent(event: MovementEvent): Promise<void> {
    const knockbackData = event.getData().knockback;
    if (!knockbackData) {
      throw new Error('Dados de knockback ausentes no evento');
    }

    const { entityId, fromPosition, toPosition, source, strength } = knockbackData;

    // Criar um movimento de knockback
    const movement = Movement.createKnockback(entityId, fromPosition, toPosition, source);

    // Salvar o movimento
    const savedMovement = await this.movementRepository.save(movement);

    // Atualizar a posição da entidade
    this.entityTrackingService.updateEntityPosition(entityId, toPosition);
    this.entityTrackingService.finishEntityMovement(entityId, toPosition);

    // Completar o evento
    event.complete({
      movement: savedMovement,
      status: MovementStatus.SUCCESS,
      actualPosition: toPosition,
      staminaCost: 0,
      duration: 200, // Knockback tem duração fixa
      collisions: [],
      strength,
    });
  }

  // Processa um evento de atualização de posição
  private async processPositionUpdateEvent(event: MovementEvent): Promise<void> {
    const updateData = event.getData().positionUpdate;
    if (!updateData) {
      throw new Error('Dados de atualização de posição ausentes no evento');
    }

    const { entityId, position, direction } = updateData;

    // Atualizar a posição da entidade
    this.entityTrackingService.updateEntityPosition(entityId, position);

    // Completar o evento
    event.complete({
      entityId,
      position,
      direction,
      updated: true,
    });
  }

  // Processa um evento de cancelamento de movimento
  private async processCancelMovementEvent(event: MovementEvent): Promise<void> {
    const cancelData = event.getData().cancel;
    if (!cancelData) {
      throw new Error('Dados de cancelamento ausentes no evento');
    }

    const entityIds = event.getEntityIds();
    const cancelReason = cancelData.reason;

    // Cancelar movimentos pendentes para essas entidades
    const cancelledCount = this.movementQueueService.cancelPendingEntityEvents(
      entityIds[0], 
      cancelReason
    );

    // Finalizar o movimento das entidades
    for (const entityId of entityIds) {
      this.entityTrackingService.finishEntityMovement(entityId);
    }

    // Completar o evento
    event.complete({
      cancelledCount,
      entityIds,
      reason: cancelReason,
    });
  }

  // Valida se um movimento é possível
  private async validateMovement(
    entityId: string, 
    fromPosition: any, 
    toPosition: any, 
    movementType: MovementType
  ): Promise<{ isValid: boolean; reason?: string }> {
    // Verificar se a posição de destino está dentro dos limites
    if (toPosition.x < 0 || toPosition.y < 0 || toPosition.z < 0) {
      return { isValid: false, reason: 'Posição de destino fora dos limites' };
    }

    if (toPosition.x > 9999 || toPosition.y > 9999 || toPosition.z > 15) {
      return { isValid: false, reason: 'Posição de destino fora dos limites' };
    }

    // Verificar se o movimento não é muito rápido (rate limiting)
    if (movementType === MovementType.WALK || movementType === MovementType.RUN) {
      const recentMovements = await this.movementRepository.findRecentMovementsByEntity(entityId, 1);
      if (recentMovements.length > 20) { // Máximo 20 movimentos por minuto
        return { isValid: false, reason: 'Movimento muito rápido (rate limiting)' };
      }
    }

    // Verificar se a distância é válida para o tipo de movimento
    const distance = Math.sqrt(
      Math.pow(toPosition.x - fromPosition.x, 2) + 
      Math.pow(toPosition.y - fromPosition.y, 2)
    );

    if (movementType === MovementType.WALK && distance > 1.5) {
      return { isValid: false, reason: 'Distância muito grande para caminhada' };
    }

    if (movementType === MovementType.RUN && distance > 3) {
      return { isValid: false, reason: 'Distância muito grande para corrida' };
    }

    // Verificar se a posição de destino está ocupada
    const entitiesAtPosition = this.entityTrackingService.getEntitiesInArea(
      toPosition.x, toPosition.y, toPosition.x, toPosition.y, toPosition.z
    );

    if (entitiesAtPosition.length > 0 && !entitiesAtPosition.some(e => e.entityId === entityId)) {
      return { isValid: false, reason: 'Posição de destino ocupada' };
    }

    return { isValid: true };
  }
}
