import { Injectable } from '@nestjs/common';
import { Position } from '../../domain/entities/movement.entity';

interface EntityMovementState {
  entityId: string;
  currentPosition: Position;
  lastMoveTime: Date;
  isMoving: boolean;
  targetPosition?: Position;
  speed?: number;
}

@Injectable()
export class MovingEntitiesTrackingService {
  // Mapa para armazenar o estado de movimento das entidades
  private entityStates: Map<string, EntityMovementState> = new Map();

  // Registra uma entidade como em movimento
  startEntityMovement(
    entityId: string, 
    currentPosition: Position, 
    targetPosition: Position,
    speed: number = 1.0
  ): void {
    this.entityStates.set(entityId, {
      entityId,
      currentPosition: { ...currentPosition },
      lastMoveTime: new Date(),
      isMoving: true,
      targetPosition: { ...targetPosition },
      speed,
    });
  }

  // Atualiza a posição de uma entidade
  updateEntityPosition(entityId: string, position: Position): void {
    const state = this.entityStates.get(entityId);
    
    if (state) {
      state.currentPosition = { ...position };
      state.lastMoveTime = new Date();
      
      // Se chegou na posição alvo, marca como não estando mais em movimento
      if (state.targetPosition && 
          position.x === state.targetPosition.x && 
          position.y === state.targetPosition.y && 
          position.z === state.targetPosition.z) {
        state.isMoving = false;
        state.targetPosition = undefined;
      }
      
      this.entityStates.set(entityId, state);
    } else {
      // Se não existe, cria um novo estado
      this.entityStates.set(entityId, {
        entityId,
        currentPosition: { ...position },
        lastMoveTime: new Date(),
        isMoving: false
      });
    }
  }

  // Finaliza o movimento de uma entidade
  finishEntityMovement(entityId: string, finalPosition?: Position): void {
    const state = this.entityStates.get(entityId);
    
    if (state) {
      state.isMoving = false;
      
      if (finalPosition) {
        state.currentPosition = { ...finalPosition };
      }
      
      state.lastMoveTime = new Date();
      state.targetPosition = undefined;
      
      this.entityStates.set(entityId, state);
    }
  }

  // Verifica se uma entidade está em movimento
  isEntityMoving(entityId: string): boolean {
    const state = this.entityStates.get(entityId);
    return state ? state.isMoving : false;
  }

  // Obtém a posição atual de uma entidade
  getEntityPosition(entityId: string): Position | null {
    const state = this.entityStates.get(entityId);
    return state ? { ...state.currentPosition } : null;
  }

  // Obtém o estado de movimento completo de uma entidade
  getEntityMovementState(entityId: string): EntityMovementState | null {
    const state = this.entityStates.get(entityId);
    return state ? { ...state } : null;
  }
  
  // Alias para getEntityMovementState (para compatibilidade com o service)
  getEntityState(entityId: string): EntityMovementState | null {
    return this.getEntityMovementState(entityId);
  }

  // Remove uma entidade do rastreamento
  removeEntity(entityId: string): boolean {
    return this.entityStates.delete(entityId);
  }

  // Obtém todas as entidades em movimento
  getAllMovingEntities(): EntityMovementState[] {
    const movingEntities: EntityMovementState[] = [];
    
    this.entityStates.forEach(state => {
      if (state.isMoving) {
        movingEntities.push({ ...state });
      }
    });
    
    return movingEntities;
  }

  // Obtém todas as entidades rastreadas
  getAllTrackedEntities(): EntityMovementState[] {
    const entities: EntityMovementState[] = [];
    
    this.entityStates.forEach(state => {
      entities.push({ ...state });
    });
    
    return entities;
  }

  // Alias para getAllTrackedEntities (para compatibilidade com o teste)
  getAllEntities(): EntityMovementState[] {
    return this.getAllTrackedEntities();
  }

  // Obtém entidades em um raio específico
  getEntitiesInRange(center: Position, range: number): string[] {
    const entityIds: string[] = [];
    
    this.entityStates.forEach(state => {
      const pos = state.currentPosition;
      if (pos.z === center.z) {
        // Cálculo da distância euclidiana 2D
        const distance = Math.sqrt(
          Math.pow(pos.x - center.x, 2) + 
          Math.pow(pos.y - center.y, 2)
        );
        
        if (distance <= range) {
          entityIds.push(state.entityId);
        }
      }
    });
    
    return entityIds;
  }

  // Obtém entidades numa área específica
  getEntitiesInArea(startX: number, startY: number, endX: number, endY: number, z: number): EntityMovementState[] {
    const entities: EntityMovementState[] = [];
    
    this.entityStates.forEach(state => {
      const pos = state.currentPosition;
      if (pos.z === z && 
          pos.x >= startX && pos.x <= endX && 
          pos.y >= startY && pos.y <= endY) {
        entities.push({ ...state });
      }
    });
    
    return entities;
  }

  // Limpa dados antigos de entidades que não se movem há algum tempo
  cleanupInactiveEntities(minutesThreshold: number = 30): number {
    const now = new Date();
    const threshold = minutesThreshold * 60 * 1000; // converte para milissegundos
    let removedCount = 0;
    
    this.entityStates.forEach((state, entityId) => {
      const timeSinceLastMove = now.getTime() - state.lastMoveTime.getTime();
      
      if (timeSinceLastMove > threshold && !state.isMoving) {
        this.entityStates.delete(entityId);
        removedCount++;
      }
    });
    
    return removedCount;
  }
}
