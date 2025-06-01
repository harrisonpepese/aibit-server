import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MovementService } from './movement.service';

@Controller('movement')
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @Get(':id')
  getMovement(@Param('id') id: string) {
    return this.movementService.getMovement(id);
  }

  @Post()
  moveCharacter(@Body() moveDto: { characterId: string; direction: string }) {
    return this.movementService.moveCharacter(moveDto.characterId, moveDto.direction);
  }
}