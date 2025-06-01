import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CombatService } from './combat.service';

@Controller('combat')
export class CombatController {
  constructor(private readonly combatService: CombatService) {}

  @Post('attack')
  async attack(@Body() attackDto: { attackerId: string; targetId: string }) {
    return this.combatService.attack(attackDto.attackerId, attackDto.targetId);
  }

  @Get('status/:characterId')
  async getStatus(@Param('characterId') characterId: string) {
    return this.combatService.getStatus(characterId);
  }
}