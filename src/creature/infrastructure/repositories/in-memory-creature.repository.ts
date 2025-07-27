import { Injectable } from '@nestjs/common';
import { CreatureRepository } from '../../domain/repositories/creature.repository';
import { Creature } from '../../domain/entities/creature.entity';
import { Position } from '../../domain/value-objects/position.vo';

@Injectable()
export class InMemoryCreatureRepository implements CreatureRepository {
  private creatures: Map<string, Creature> = new Map();

  async save(creature: Creature): Promise<void> {
    this.creatures.set(creature.getId(), creature);
  }

  async findById(id: string): Promise<Creature | null> {
    return this.creatures.get(id) || null;
  }

  async findByName(name: string): Promise<Creature[]> {
    const normalizedName = name.toLowerCase();
    
    return Array.from(this.creatures.values())
      .filter(creature => creature.getName().toLowerCase().includes(normalizedName));
  }

  async findByType(type: string): Promise<Creature[]> {
    const normalizedType = type.toLowerCase();
    
    return Array.from(this.creatures.values())
      .filter(creature => creature.getType().getValue().toLowerCase() === normalizedType);
  }

  async findByPosition(position: Position): Promise<Creature[]> {
    return Array.from(this.creatures.values())
      .filter(creature => {
        const creaturePos = creature.getPosition();
        return creaturePos.getX() === position.getX() && 
               creaturePos.getY() === position.getY() && 
               creaturePos.getZ() === position.getZ();
      });
  }

  async findInRadius(position: Position, radius: number): Promise<Creature[]> {
    return Array.from(this.creatures.values())
      .filter(creature => {
        const creaturePos = creature.getPosition();
        
        // Filtrar por mesmo andar (z)
        if (creaturePos.getZ() !== position.getZ()) {
          return false;
        }
        
        // Calcular distância e comparar com o raio
        return creaturePos.distanceTo(position) <= radius;
      });
  }

  async findBySpawnId(spawnId: string): Promise<Creature[]> {
    return Array.from(this.creatures.values())
      .filter(creature => creature.getSpawnId() === spawnId);
  }

  async findAll(): Promise<Creature[]> {
    return Array.from(this.creatures.values());
  }

  async delete(id: string): Promise<void> {
    this.creatures.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.creatures.has(id);
  }
}
