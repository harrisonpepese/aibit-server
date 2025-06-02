import { Injectable } from '@nestjs/common';
import { Combat, CombatState } from '../../domain/entities/combat.entity';
import { CombatRepository } from '../../domain/repositories/combat.repository';

@Injectable()
export class InMemoryCombatRepository implements CombatRepository {
  private combats: Map<string, Combat> = new Map();

  async findById(id: string): Promise<Combat | null> {
    return this.combats.get(id) || null;
  }

  async save(combat: Combat): Promise<Combat> {
    this.combats.set(combat.getId(), combat);
    return combat;
  }

  async findByParticipant(participantId: string): Promise<Combat[]> {
    return Array.from(this.combats.values()).filter(combat => 
      combat.getInitiatorId() === participantId || combat.getTargetId() === participantId
    );
  }

  async findActiveCombatByParticipant(participantId: string): Promise<Combat | null> {
    const activeCombat = Array.from(this.combats.values()).find(combat => 
      (combat.getInitiatorId() === participantId || combat.getTargetId() === participantId) && 
      combat.getState() === CombatState.ACTIVE
    );
    
    return activeCombat || null;
  }

  async findAll(): Promise<Combat[]> {
    return Array.from(this.combats.values());
  }

  async delete(id: string): Promise<boolean> {
    return this.combats.delete(id);
  }
}
