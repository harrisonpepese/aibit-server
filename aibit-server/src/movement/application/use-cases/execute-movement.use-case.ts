import { Inject, Injectable } from '@nestjs/common';
import { MovementRepository } from '../../domain/repositories/movement.repository';
import { MOVEMENT_REPOSITORY_TOKEN } from '../../domain/repositories/movement.repository.token';
import { Movement, MovementType, MovementSource, Position, MovementResult, MovementStatus } from '../../domain/entities/movement.entity';

export interface ExecuteMovementRequest {
  entityId: string;
  fromPosition: Position;
  toPosition: Position;
  movementType: MovementType;
  source: MovementSource;
  speed?: number;
  validateMovement?: boolean;
}

@Injectable()
export class ExecuteMovementUseCase {
  constructor(
    @Inject(MOVEMENT_REPOSITORY_TOKEN)
    private readonly movementRepository: MovementRepository,
  ) {}

  async execute(request: ExecuteMovementRequest): Promise<MovementResult> {
    this.validateRequest(request);

    const {
      entityId,
      fromPosition,
      toPosition,
      movementType,
      source,
      speed = 1.0,
      validateMovement = true,
    } = request;

    // Validar movimento se solicitado
    if (validateMovement) {
      const validation = await this.validateMovement(request);
      if (!validation.isValid) {
        return {
          movement: null as any,
          status: MovementStatus.BLOCKED,
          actualPosition: fromPosition,
          staminaCost: 0,
          duration: 0,
          collisions: [],
        };
      }
    }

    // Criar movimento baseado no tipo
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

    // Salvar movimento
    const savedMovement = await this.movementRepository.save(movement);

    return {
      movement: savedMovement,
      status: MovementStatus.SUCCESS,
      actualPosition: toPosition,
      staminaCost: movement.getStaminaCost(),
      duration: movement.getDuration(),
      collisions: [],
    };
  }

  private validateRequest(request: ExecuteMovementRequest): void {
    if (!request.entityId || request.entityId.trim().length === 0) {
      throw new Error('ID da entidade é obrigatório');
    }

    if (!request.fromPosition || !request.toPosition) {
      throw new Error('Posições de origem e destino são obrigatórias');
    }

    if (!request.source) {
      throw new Error('Fonte do movimento é obrigatória');
    }

    if (!Object.values(MovementType).includes(request.movementType)) {
      throw new Error('Tipo de movimento inválido');
    }
  }

  private async validateMovement(request: ExecuteMovementRequest): Promise<{ isValid: boolean; reason?: string }> {
    const { entityId, fromPosition, toPosition, movementType } = request;

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
      if (recentMovements.length > 10) { // Máximo 10 movimentos por minuto
        return { isValid: false, reason: 'Movimento muito rápido' };
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

    if (movementType === MovementType.RUN && distance > 2) {
      return { isValid: false, reason: 'Distância muito grande para corrida' };
    }

    // Verificar se não há outras entidades na posição de destino
    const entitiesInPosition = await this.movementRepository.findEntitiesInRange(
      toPosition.x, 
      toPosition.y, 
      toPosition.z, 
      0
    );

    if (entitiesInPosition.length > 0 && !entitiesInPosition.includes(entityId)) {
      return { isValid: false, reason: 'Posição ocupada por outra entidade' };
    }

    return { isValid: true };
  }
}
