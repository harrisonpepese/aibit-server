import { Injectable } from '@nestjs/common';
import { Damage } from '../../domain/entities/damage.entity';
import { DamageRepository } from '../../domain/repositories/damage.repository';

interface DamageRecord {
  damage: Damage;
  targetId?: string; // Adicionamos targetId para rastrear o alvo
}

@Injectable()
export class InMemoryDamageRepository implements DamageRepository {
  private damages: Map<string, DamageRecord> = new Map();
  private damagesBySource: Map<string, string[]> = new Map();
  private damagesByTarget: Map<string, string[]> = new Map();

  async save(damage: Damage, targetId?: string): Promise<Damage> {
    const record: DamageRecord = { damage, targetId };
    this.damages.set(damage.getId(), record);

    // Indexar por fonte
    const sourceId = damage.getSource().sourceId;
    if (!this.damagesBySource.has(sourceId)) {
      this.damagesBySource.set(sourceId, []);
    }
    this.damagesBySource.get(sourceId)!.push(damage.getId());

    // Indexar por alvo se fornecido
    if (targetId) {
      if (!this.damagesByTarget.has(targetId)) {
        this.damagesByTarget.set(targetId, []);
      }
      this.damagesByTarget.get(targetId)!.push(damage.getId());
    }

    return damage;
  }

  async findById(id: string): Promise<Damage | null> {
    const record = this.damages.get(id);
    return record ? record.damage : null;
  }

  async findBySourceId(sourceId: string): Promise<Damage[]> {
    const damageIds = this.damagesBySource.get(sourceId) || [];
    const result: Damage[] = [];

    for (const id of damageIds) {
      const record = this.damages.get(id);
      if (record) {
        result.push(record.damage);
      }
    }

    return result;
  }

  async findByTargetId(targetId: string): Promise<Damage[]> {
    const damageIds = this.damagesByTarget.get(targetId) || [];
    const result: Damage[] = [];

    for (const id of damageIds) {
      const record = this.damages.get(id);
      if (record) {
        result.push(record.damage);
      }
    }

    return result;
  }

  async findByTimeRange(startTime: Date, endTime: Date): Promise<Damage[]> {
    const result: Damage[] = [];

    for (const record of this.damages.values()) {
      const timestamp = record.damage.getTimestamp();
      if (timestamp >= startTime && timestamp <= endTime) {
        result.push(record.damage);
      }
    }

    return result;
  }

  async findRecentDamage(targetId: string, minutes: number): Promise<Damage[]> {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - minutes * 60 * 1000);
    
    const damageIds = this.damagesByTarget.get(targetId) || [];
    const result: Damage[] = [];

    for (const id of damageIds) {
      const record = this.damages.get(id);
      if (record) {
        const timestamp = record.damage.getTimestamp();
        if (timestamp >= startTime && timestamp <= endTime) {
          result.push(record.damage);
        }
      }
    }

    return result.sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());
  }

  async getTotalDamageDealt(sourceId: string): Promise<number> {
    const damages = await this.findBySourceId(sourceId);
    return damages.reduce((total, damage) => total + damage.getAmount(), 0);
  }

  async getTotalDamageReceived(targetId: string): Promise<number> {
    const damages = await this.findByTargetId(targetId);
    return damages.reduce((total, damage) => total + damage.getAmount(), 0);
  }

  async getDamageHistory(entityId: string, limit?: number): Promise<Damage[]> {
    // Combinar danos causados e recebidos
    const [dealtDamages, receivedDamages] = await Promise.all([
      this.findBySourceId(entityId),
      this.findByTargetId(entityId),
    ]);

    const allDamages = [...dealtDamages, ...receivedDamages];
    
    // Ordenar por timestamp decrescente
    allDamages.sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());

    return limit ? allDamages.slice(0, limit) : allDamages;
  }

  async delete(id: string): Promise<void> {
    const record = this.damages.get(id);
    if (!record) {
      throw new Error('Dano não encontrado para exclusão');
    }

    // Remover dos índices
    const sourceId = record.damage.getSource().sourceId;
    const sourceIds = this.damagesBySource.get(sourceId);
    if (sourceIds) {
      const index = sourceIds.indexOf(id);
      if (index > -1) {
        sourceIds.splice(index, 1);
      }
    }

    if (record.targetId) {
      const targetIds = this.damagesByTarget.get(record.targetId);
      if (targetIds) {
        const index = targetIds.indexOf(id);
        if (index > -1) {
          targetIds.splice(index, 1);
        }
      }
    }

    // Remover o registro principal
    this.damages.delete(id);
  }

  async deleteOlderThan(date: Date): Promise<void> {
    const idsToDelete: string[] = [];

    for (const [id, record] of this.damages.entries()) {
      if (record.damage.getTimestamp() < date) {
        idsToDelete.push(id);
      }
    }

    // Deletar em lote
    for (const id of idsToDelete) {
      await this.delete(id);
    }
  }

  // Métodos auxiliares para testes
  clear(): void {
    this.damages.clear();
    this.damagesBySource.clear();
    this.damagesByTarget.clear();
  }

  size(): number {
    return this.damages.size;
  }

  // Método específico para este repositório que permite associar targetId
  async saveWithTarget(damage: Damage, targetId: string): Promise<Damage> {
    return this.save(damage, targetId);
  }
}
