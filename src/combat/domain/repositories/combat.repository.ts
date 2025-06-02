import { Combat } from '../entities/combat.entity';

export interface CombatRepository {
  findById(id: string): Promise<Combat | null>;
  save(combat: Combat): Promise<Combat>;
  findByParticipant(participantId: string): Promise<Combat[]>;
  findActiveCombatByParticipant(participantId: string): Promise<Combat | null>;
  findAll(): Promise<Combat[]>;
  delete(id: string): Promise<boolean>;
}
