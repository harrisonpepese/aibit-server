import { Position } from 'src/@shared/domain/value-objects/Position.vo';
import { Creature } from '../entities/creature.entity';


export interface CreatureRepository {
  save(creature: Creature): Promise<void>;
  findById(id: string): Promise<Creature | null>;
  findByName(name: string): Promise<Creature[]>;
  findByType(type: string): Promise<Creature[]>;
  findByPosition(position: Position): Promise<Creature[]>;
  findInRadius(position: Position, radius: number): Promise<Creature[]>;
  findBySpawnId(spawnId: string): Promise<Creature[]>;
  findAll(): Promise<Creature[]>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
