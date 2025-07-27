import { Inject, Injectable } from '@nestjs/common';
import { Creature } from '../../domain/entities/creature.entity';
import { CreatureRepository } from '../../domain/repositories/creature.repository';
import { CREATURE_REPOSITORY } from '../../domain/repositories/creature.repository.token';
import { CreatureType } from '../../domain/value-objects/creature-type.vo';
import { CreatureStats } from '../../domain/value-objects/creature-stats.vo';
import { Position } from '../../domain/value-objects/position.vo';
import { CreateCreatureDto } from '../../dto/create-creature.dto';

@Injectable()
export class CreateCreatureUseCase {
  constructor(
    @Inject(CREATURE_REPOSITORY)
    private creatureRepository: CreatureRepository,
  ) {}

  async execute(dto: CreateCreatureDto): Promise<Creature> {
    // Criar objetos de valor
    const type = new CreatureType(
      dto.type.value,
      dto.type.isBoss,
      dto.type.isHostile
    );

    const position = new Position(
      dto.position.x,
      dto.position.y,
      dto.position.z
    );

    const stats = new CreatureStats(
      dto.stats.maxHealth,
      dto.stats.maxMana,
      dto.stats.attack,
      dto.stats.defense,
      dto.stats.speed,
      dto.stats.level,
      dto.stats.experience
    );

    // Criar a entidade
    const creature = Creature.create(
      dto.name,
      type,
      position,
      stats,
      dto.spawnId || null
    );

    // Salvar no repositório
    await this.creatureRepository.save(creature);

    return creature;
  }

  async executeBatch(dtos: CreateCreatureDto[]): Promise<Creature[]> {
    const creatures: Creature[] = [];

    for (const dto of dtos) {
      const creature = await this.execute(dto);
      creatures.push(creature);
    }

    return creatures;
  }
}
