import { Movement } from '../entities/movement.entity';

export interface MovementRepository {
  // Operações básicas
  save(movement: Movement): Promise<Movement>;
  findById(id: string): Promise<Movement | null>;
  findAll(): Promise<Movement[]>;
  delete(id: string): Promise<void>;

  // Buscar por entidade
  findByEntityId(entityId: string): Promise<Movement[]>;
  findRecentMovementsByEntity(entityId: string, minutes: number): Promise<Movement[]>;
  
  // Buscar por posição
  findMovementsToPosition(x: number, y: number, z: number): Promise<Movement[]>;
  findMovementsFromPosition(x: number, y: number, z: number): Promise<Movement[]>;
  findMovementsInArea(
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number, 
    z: number
  ): Promise<Movement[]>;

  // Buscar por tempo
  findByTimeRange(startTime: Date, endTime: Date): Promise<Movement[]>;
  findRecentMovements(minutes: number): Promise<Movement[]>;

  // Buscar por tipo
  findByMovementType(type: string): Promise<Movement[]>;
  findBySource(sourceId: string): Promise<Movement[]>;

  // Estatísticas
  countMovementsByEntity(entityId: string): Promise<number>;
  countMovementsByTimeRange(startTime: Date, endTime: Date): Promise<number>;
  getAverageSpeed(entityId: string): Promise<number>;
  getTotalDistance(entityId: string): Promise<number>;

  // Operações especiais
  getLastMovement(entityId: string): Promise<Movement | null>;
  getMovementPath(entityId: string, limit?: number): Promise<Movement[]>;
  findEntitiesInRange(x: number, y: number, z: number, range: number): Promise<string[]>;
}
