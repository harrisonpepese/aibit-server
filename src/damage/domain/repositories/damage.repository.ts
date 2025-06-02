import { Damage } from '../entities/damage.entity';

export interface DamageRepository {
  save(damage: Damage): Promise<Damage>;
  findById(id: string): Promise<Damage | null>;
  findBySourceId(sourceId: string): Promise<Damage[]>;
  findByTargetId(targetId: string): Promise<Damage[]>;
  findByTimeRange(startTime: Date, endTime: Date): Promise<Damage[]>;
  findRecentDamage(targetId: string, minutes: number): Promise<Damage[]>;
  getTotalDamageDealt(sourceId: string): Promise<number>;
  getTotalDamageReceived(targetId: string): Promise<number>;
  getDamageHistory(entityId: string, limit?: number): Promise<Damage[]>;
  delete(id: string): Promise<void>;
  deleteOlderThan(date: Date): Promise<void>;
}
