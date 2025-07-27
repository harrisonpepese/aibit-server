import { Injectable } from '@nestjs/common';
import { Creature } from './domain/entities/creature.entity';
import { CreateCreatureUseCase } from './application/use-cases/create-creature.use-case';
import { GetCreaturesUseCase } from './application/use-cases/get-creatures.use-case';
import { UpdateCreatureUseCase } from './application/use-cases/update-creature.use-case';
import { CreateCreatureDto, CreateCreatureBatchDto } from './dto/create-creature.dto';
import { 
  UpdateCreaturePositionDto, 
  UpdateCreatureStatsDto,
  ApplyDamageDto,
  HealCreatureDto,
  UseManaDto,
  AddStatusEffectDto,
  RemoveStatusEffectDto
} from './dto/update-creature.dto';
import { CreatureResponseDto, CreatureListResponseDto } from './dto/creature-response.dto';

@Injectable()
export class CreatureService {
  constructor(
    private readonly createCreatureUseCase: CreateCreatureUseCase,
    private readonly getCreaturesUseCase: GetCreaturesUseCase,
    private readonly updateCreatureUseCase: UpdateCreatureUseCase,
  ) {}

  // Métodos de criação
  async createCreature(dto: CreateCreatureDto): Promise<CreatureResponseDto> {
    const creature = await this.createCreatureUseCase.execute(dto);
    return this.mapToResponseDto(creature);
  }

  async createCreatureBatch(dto: CreateCreatureBatchDto): Promise<CreatureListResponseDto> {
    const creatures = await this.createCreatureUseCase.executeBatch(dto.creatures);
    return this.mapToListResponseDto(creatures);
  }

  // Métodos de consulta
  async getCreatureById(id: string): Promise<CreatureResponseDto> {
    const creature = await this.getCreaturesUseCase.getById(id);
    return this.mapToResponseDto(creature);
  }

  async getCreaturesByName(name: string): Promise<CreatureListResponseDto> {
    const creatures = await this.getCreaturesUseCase.getByName(name);
    return this.mapToListResponseDto(creatures);
  }

  async getCreaturesByType(type: string): Promise<CreatureListResponseDto> {
    const creatures = await this.getCreaturesUseCase.getByType(type);
    return this.mapToListResponseDto(creatures);
  }

  async getCreaturesByPosition(x: number, y: number, z: number): Promise<CreatureListResponseDto> {
    const creatures = await this.getCreaturesUseCase.getByPosition(x, y, z);
    return this.mapToListResponseDto(creatures);
  }

  async getCreaturesInRadius(x: number, y: number, z: number, radius: number): Promise<CreatureListResponseDto> {
    const creatures = await this.getCreaturesUseCase.getInRadius(x, y, z, radius);
    return this.mapToListResponseDto(creatures);
  }

  async getCreaturesBySpawnId(spawnId: string): Promise<CreatureListResponseDto> {
    const creatures = await this.getCreaturesUseCase.getBySpawnId(spawnId);
    return this.mapToListResponseDto(creatures);
  }

  async getAllCreatures(): Promise<CreatureListResponseDto> {
    const creatures = await this.getCreaturesUseCase.getAll();
    return this.mapToListResponseDto(creatures);
  }

  // Métodos de atualização
  async updateCreaturePosition(id: string, dto: UpdateCreaturePositionDto): Promise<CreatureResponseDto> {
    const creature = await this.updateCreatureUseCase.updatePosition(id, dto);
    return this.mapToResponseDto(creature);
  }

  async updateCreatureStats(id: string, dto: UpdateCreatureStatsDto): Promise<CreatureResponseDto> {
    const creature = await this.updateCreatureUseCase.updateStats(id, dto);
    return this.mapToResponseDto(creature);
  }

  async updateCreatureName(id: string, name: string): Promise<CreatureResponseDto> {
    const creature = await this.updateCreatureUseCase.updateName(id, name);
    return this.mapToResponseDto(creature);
  }

  async applyDamage(id: string, dto: ApplyDamageDto): Promise<CreatureResponseDto> {
    const creature = await this.updateCreatureUseCase.applyDamage(id, dto.amount);
    return this.mapToResponseDto(creature);
  }

  async healCreature(id: string, dto: HealCreatureDto): Promise<CreatureResponseDto> {
    const creature = await this.updateCreatureUseCase.healCreature(id, dto.amount);
    return this.mapToResponseDto(creature);
  }

  async useMana(id: string, dto: UseManaDto): Promise<CreatureResponseDto> {
    const creature = await this.updateCreatureUseCase.useMana(id, dto.amount);
    return this.mapToResponseDto(creature);
  }

  async restoreMana(id: string, dto: UseManaDto): Promise<CreatureResponseDto> {
    const creature = await this.updateCreatureUseCase.restoreMana(id, dto.amount);
    return this.mapToResponseDto(creature);
  }

  async addStatusEffect(id: string, dto: AddStatusEffectDto): Promise<CreatureResponseDto> {
    const creature = await this.updateCreatureUseCase.addStatusEffect(
      id, 
      dto.type, 
      dto.duration,
      dto.intensity
    );
    return this.mapToResponseDto(creature);
  }

  async removeStatusEffect(id: string, dto: RemoveStatusEffectDto): Promise<CreatureResponseDto> {
    const creature = await this.updateCreatureUseCase.removeStatusEffect(id, dto.type);
    return this.mapToResponseDto(creature);
  }

  async killCreature(id: string): Promise<CreatureResponseDto> {
    const creature = await this.updateCreatureUseCase.killCreature(id);
    return this.mapToResponseDto(creature);
  }

  async reviveCreature(id: string): Promise<CreatureResponseDto> {
    const creature = await this.updateCreatureUseCase.reviveCreature(id);
    return this.mapToResponseDto(creature);
  }

  // Mapeadores para DTOs de resposta
  private mapToResponseDto(creature: Creature): CreatureResponseDto {
    const primitives = creature.toPrimitives();
    
    return {
      id: primitives.id,
      name: primitives.name,
      type: primitives.type,
      position: primitives.position,
      stats: primitives.stats,
      state: primitives.state,
      spawnId: primitives.spawnId,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt
    };
  }

  private mapToListResponseDto(creatures: Creature[]): CreatureListResponseDto {
    return {
      items: creatures.map(creature => this.mapToResponseDto(creature)),
      total: creatures.length
    };
  }
}