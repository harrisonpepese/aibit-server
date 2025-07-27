import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  Query, 
  HttpCode, 
  HttpStatus,
  ValidationPipe,
  ParseIntPipe
} from '@nestjs/common';
import { CreatureService } from './creature.service';
import { 
  CreateCreatureDto, 
  CreateCreatureBatchDto 
} from './dto/create-creature.dto';
import {
  UpdateCreaturePositionDto,
  UpdateCreatureStatsDto,
  ApplyDamageDto,
  HealCreatureDto,
  UseManaDto,
  AddStatusEffectDto,
  RemoveStatusEffectDto
} from './dto/update-creature.dto';
import {
  CreatureResponseDto,
  CreatureListResponseDto
} from './dto/creature-response.dto';

@Controller('creatures')
export class CreatureController {
  constructor(private readonly creatureService: CreatureService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCreature(
    @Body(ValidationPipe) createCreatureDto: CreateCreatureDto
  ): Promise<CreatureResponseDto> {
    return this.creatureService.createCreature(createCreatureDto);
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  async createCreatureBatch(
    @Body(ValidationPipe) createCreatureBatchDto: CreateCreatureBatchDto
  ): Promise<CreatureListResponseDto> {
    return this.creatureService.createCreatureBatch(createCreatureBatchDto);
  }

  @Get()
  async getAllCreatures(): Promise<CreatureListResponseDto> {
    return this.creatureService.getAllCreatures();
  }

  @Get(':id')
  async getCreatureById(
    @Param('id') id: string
  ): Promise<CreatureResponseDto> {
    return this.creatureService.getCreatureById(id);
  }

  @Get('search/name')
  async getCreaturesByName(
    @Query('name') name: string
  ): Promise<CreatureListResponseDto> {
    return this.creatureService.getCreaturesByName(name);
  }

  @Get('search/type')
  async getCreaturesByType(
    @Query('type') type: string
  ): Promise<CreatureListResponseDto> {
    return this.creatureService.getCreaturesByType(type);
  }

  @Get('search/position')
  async getCreaturesByPosition(
    @Query('x', ParseIntPipe) x: number,
    @Query('y', ParseIntPipe) y: number,
    @Query('z', ParseIntPipe) z: number
  ): Promise<CreatureListResponseDto> {
    return this.creatureService.getCreaturesByPosition(x, y, z);
  }

  @Get('search/radius')
  async getCreaturesInRadius(
    @Query('x', ParseIntPipe) x: number,
    @Query('y', ParseIntPipe) y: number,
    @Query('z', ParseIntPipe) z: number,
    @Query('radius', ParseIntPipe) radius: number
  ): Promise<CreatureListResponseDto> {
    return this.creatureService.getCreaturesInRadius(x, y, z, radius);
  }

  @Get('search/spawn/:spawnId')
  async getCreaturesBySpawnId(
    @Param('spawnId') spawnId: string
  ): Promise<CreatureListResponseDto> {
    return this.creatureService.getCreaturesBySpawnId(spawnId);
  }

  @Patch(':id/position')
  async updateCreaturePosition(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePositionDto: UpdateCreaturePositionDto
  ): Promise<CreatureResponseDto> {
    return this.creatureService.updateCreaturePosition(id, updatePositionDto);
  }

  @Patch(':id/stats')
  async updateCreatureStats(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStatsDto: UpdateCreatureStatsDto
  ): Promise<CreatureResponseDto> {
    return this.creatureService.updateCreatureStats(id, updateStatsDto);
  }

  @Patch(':id/name')
  async updateCreatureName(
    @Param('id') id: string,
    @Body('name') name: string
  ): Promise<CreatureResponseDto> {
    return this.creatureService.updateCreatureName(id, name);
  }

  @Patch(':id/damage')
  async applyDamage(
    @Param('id') id: string,
    @Body(ValidationPipe) damageDto: ApplyDamageDto
  ): Promise<CreatureResponseDto> {
    return this.creatureService.applyDamage(id, damageDto);
  }

  @Patch(':id/heal')
  async healCreature(
    @Param('id') id: string,
    @Body(ValidationPipe) healDto: HealCreatureDto
  ): Promise<CreatureResponseDto> {
    return this.creatureService.healCreature(id, healDto);
  }

  @Patch(':id/use-mana')
  async useMana(
    @Param('id') id: string,
    @Body(ValidationPipe) manaDto: UseManaDto
  ): Promise<CreatureResponseDto> {
    return this.creatureService.useMana(id, manaDto);
  }

  @Patch(':id/restore-mana')
  async restoreMana(
    @Param('id') id: string,
    @Body(ValidationPipe) manaDto: UseManaDto
  ): Promise<CreatureResponseDto> {
    return this.creatureService.restoreMana(id, manaDto);
  }

  @Patch(':id/status-effect/add')
  async addStatusEffect(
    @Param('id') id: string,
    @Body(ValidationPipe) effectDto: AddStatusEffectDto
  ): Promise<CreatureResponseDto> {
    return this.creatureService.addStatusEffect(id, effectDto);
  }

  @Patch(':id/status-effect/remove')
  async removeStatusEffect(
    @Param('id') id: string,
    @Body(ValidationPipe) effectDto: RemoveStatusEffectDto
  ): Promise<CreatureResponseDto> {
    return this.creatureService.removeStatusEffect(id, effectDto);
  }

  @Patch(':id/kill')
  async killCreature(
    @Param('id') id: string
  ): Promise<CreatureResponseDto> {
    return this.creatureService.killCreature(id);
  }

  @Patch(':id/revive')
  async reviveCreature(
    @Param('id') id: string
  ): Promise<CreatureResponseDto> {
    return this.creatureService.reviveCreature(id);
  }
}