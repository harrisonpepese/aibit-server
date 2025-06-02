import { MovementStatus, Direction, MovementType } from '../domain/entities/movement.entity';

export class PositionResponseDto {
  x: number;
  y: number;
  z: number;
}

export class MovementSourceResponseDto {
  sourceId: string;
  sourceName: string;
  sourceType: string;
}

export class MovementResponseDto {
  id: string;
  entityId: string;
  fromPosition: PositionResponseDto;
  toPosition: PositionResponseDto;
  direction: Direction;
  type: MovementType;
  source: MovementSourceResponseDto;
  timestamp: Date;
  duration: number;
  staminaCost: number;
  speed: number;
  distance: number;
}

export class MovementResultResponseDto {
  movement: MovementResponseDto | null;
  status: MovementStatus;
  actualPosition: PositionResponseDto;
  staminaCost: number;
  duration: number;
  collisions: string[];
}

export class MovementStatisticsResponseDto {
  totalMovements: number;
  averageSpeed: number;
  totalDistance: number;
  movementsByType: Record<string, number>;
  mostActiveHour: number;
  averageMovementsPerDay: number;
  fastestMovement: number;
  slowestMovement: number;
}

export class EntityPositionInfoResponseDto {
  entityId: string;
  lastPosition: PositionResponseDto | null;
  lastMovementTime: Date | null;
  isOnline: boolean;
}
