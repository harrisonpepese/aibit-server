import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreatureService } from './creature.service';
import { Creature } from './creature.entity';

@Controller('creatures')
export class CreatureController {
  constructor(private readonly creatureService: CreatureService) {}

  @Get()
  findAll(): Promise<Creature[]> {
    return this.creatureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Creature> {
    return this.creatureService.findOne(id);
  }

  @Post()
  create(@Body() creature: Creature): Promise<Creature> {
    return this.creatureService.create(creature);
  }
}