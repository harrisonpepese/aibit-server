import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Creature } from '../../domain/entities/creature.entity';
import { CreatureRepository } from '../../domain/repositories/creature.repository';
import { CREATURE_REPOSITORY } from '../../domain/repositories/creature.repository.token';
import { Position } from 'src/@shared/domain/value-objects/Position.vo';


@Injectable()
export class GetCreaturesUseCase {
  constructor(
    @Inject(CREATURE_REPOSITORY)
    private creatureRepository: CreatureRepository,
  ) {}

  async getById(id: string): Promise<Creature> {
    const creature = await this.creatureRepository.findById(id);
    
    if (!creature) {
      throw new NotFoundException(`Criatura com ID ${id} não encontrada`);
    }
    
    return creature;
  }

  async getByName(name: string): Promise<Creature[]> {
    return this.creatureRepository.findByName(name);
  }

  async getByType(type: string): Promise<Creature[]> {
    return this.creatureRepository.findByType(type);
  }

  async getByPosition(x: number, y: number, z: number): Promise<Creature[]> {
    const position = new Position({x, y, z});
    return this.creatureRepository.findByPosition(position);
  }

  async getInRadius(x: number, y: number, z: number, radius: number): Promise<Creature[]> {
    const position = new Position({x, y, z});
    return this.creatureRepository.findInRadius(position, radius);
  }

  async getBySpawnId(spawnId: string): Promise<Creature[]> {
    return this.creatureRepository.findBySpawnId(spawnId);
  }

  async getAll(): Promise<Creature[]> {
    return this.creatureRepository.findAll();
  }
}
