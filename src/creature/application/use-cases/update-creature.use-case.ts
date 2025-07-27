import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Creature } from '../../domain/entities/creature.entity';
import { CreatureRepository } from '../../domain/repositories/creature.repository';
import { CREATURE_REPOSITORY } from '../../domain/repositories/creature.repository.token';

import { CreatureStats } from '../../domain/value-objects/creature-stats.vo';
import { UpdateCreaturePositionDto, UpdateCreatureStatsDto } from '../../dto/update-creature.dto';
import { Position } from 'src/@shared/domain/value-objects/Position.vo';

@Injectable()
export class UpdateCreatureUseCase {
  constructor(
    @Inject(CREATURE_REPOSITORY)
    private creatureRepository: CreatureRepository,
  ) {}

  async updatePosition(id: string, dto: UpdateCreaturePositionDto): Promise<Creature> {
    const creature = await this.getCreatureById(id);
    
    const newPosition = new Position(
      dto.position
    );
    
    creature.updatePosition(newPosition);
    
    await this.creatureRepository.save(creature);
    
    return creature;
  }

  async updateStats(id: string, dto: UpdateCreatureStatsDto): Promise<Creature> {
    const creature = await this.getCreatureById(id);
    
    // Obter os stats atuais
    const currentStats = creature.getStats();
    
    // Criar novos stats com valores atualizados
    const newStats = new CreatureStats(
      dto.maxHealth ?? currentStats.getMaxHealth(),
      dto.maxMana ?? currentStats.getMaxMana(),
      dto.attack ?? currentStats.getAttack(),
      dto.defense ?? currentStats.getDefense(),
      dto.speed ?? currentStats.getSpeed(),
      dto.level ?? currentStats.getLevel(),
      dto.experience ?? currentStats.getExperience()
    );
    
    creature.updateStats(newStats);
    
    await this.creatureRepository.save(creature);
    
    return creature;
  }

  async updateName(id: string, name: string): Promise<Creature> {
    const creature = await this.getCreatureById(id);
    
    creature.updateName(name);
    
    await this.creatureRepository.save(creature);
    
    return creature;
  }

  async applyDamage(id: string, amount: number): Promise<Creature> {
    const creature = await this.getCreatureById(id);
    
    creature.takeDamage(amount);
    
    await this.creatureRepository.save(creature);
    
    return creature;
  }

  async healCreature(id: string, amount: number): Promise<Creature> {
    const creature = await this.getCreatureById(id);
    
    creature.heal(amount);
    
    await this.creatureRepository.save(creature);
    
    return creature;
  }

  async useMana(id: string, amount: number): Promise<Creature> {
    const creature = await this.getCreatureById(id);
    
    const success = creature.useMana(amount);
    
    if (!success) {
      throw new Error('Mana insuficiente');
    }
    
    await this.creatureRepository.save(creature);
    
    return creature;
  }

  async restoreMana(id: string, amount: number): Promise<Creature> {
    const creature = await this.getCreatureById(id);
    
    creature.restoreMana(amount);
    
    await this.creatureRepository.save(creature);
    
    return creature;
  }

  async addStatusEffect(id: string, type: string, duration: number, intensity: number): Promise<Creature> {
    const creature = await this.getCreatureById(id);
    
    creature.addStatusEffect(type, duration, intensity);
    
    await this.creatureRepository.save(creature);
    
    return creature;
  }

  async removeStatusEffect(id: string, type: string): Promise<Creature> {
    const creature = await this.getCreatureById(id);
    
    creature.removeStatusEffect(type);
    
    await this.creatureRepository.save(creature);
    
    return creature;
  }

  async killCreature(id: string): Promise<Creature> {
    const creature = await this.getCreatureById(id);
    
    creature.die();
    
    await this.creatureRepository.save(creature);
    
    return creature;
  }

  async reviveCreature(id: string): Promise<Creature> {
    const creature = await this.getCreatureById(id);
    
    creature.revive();
    
    await this.creatureRepository.save(creature);
    
    return creature;
  }

  private async getCreatureById(id: string): Promise<Creature> {
    const creature = await this.creatureRepository.findById(id);
    
    if (!creature) {
      throw new NotFoundException(`Criatura com ID ${id} não encontrada`);
    }
    
    return creature;
  }
}
