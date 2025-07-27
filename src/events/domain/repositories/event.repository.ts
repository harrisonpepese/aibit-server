import { GameEvent } from '../entities/game-event.entity';

/**
 * Interface para o repositório de eventos.
 */
export interface EventRepository {
  /**
   * Salva um evento no repositório.
   */
  save(event: GameEvent): Promise<GameEvent>;
  
  /**
   * Busca um evento pelo ID.
   */
  findById(id: string): Promise<GameEvent | null>;
  
  /**
   * Busca eventos por tipo.
   */
  findByType(type: string, limit?: number): Promise<GameEvent[]>;
  
  /**
   * Busca eventos por status.
   */
  findByStatus(status: string, limit?: number): Promise<GameEvent[]>;
  
  /**
   * Busca eventos por módulo de origem.
   */
  findBySourceModule(module: string, limit?: number): Promise<GameEvent[]>;
  
  /**
   * Busca eventos por visibilidade para uma entidade específica.
   */
  findByEntityVisibility(entityId: string, limit?: number): Promise<GameEvent[]>;
  
  /**
   * Busca eventos visíveis em uma área específica.
   */
  findByAreaVisibility(x: number, y: number, z: number, radius: number, limit?: number): Promise<GameEvent[]>;
  
  /**
   * Atualiza o status de um evento.
   */
  updateStatus(id: string, status: string, result?: any): Promise<GameEvent>;
  
  /**
   * Exclui um evento.
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Exclui eventos mais antigos que uma determinada data.
   */
  deleteOlderThan(date: Date): Promise<number>;
}
