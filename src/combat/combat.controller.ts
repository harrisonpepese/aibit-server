import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { CombatService } from './combat.service';
import { PerformAttackDto } from './dto/perform-attack.dto';
import { EndCombatDto } from './dto/end-combat.dto';
import { AttackType, DamageType } from './domain/entities/attack.entity';
import { CombatEffectType } from './domain/value-objects/combat-effect.vo';

@Controller('combat')
export class CombatController {
  constructor(private readonly combatService: CombatService) {}

  @Post('attack')
  async performAttack(@Body() performAttackDto: PerformAttackDto) {
    return this.combatService.performAttack(performAttackDto);
  }

  @Post('end')
  async endCombat(@Body() endCombatDto: EndCombatDto) {
    return this.combatService.endCombat(endCombatDto);
  }

  @Get('status/:participantId')
  async getCombatStatus(@Param('participantId') participantId: string) {
    return this.combatService.getCombatStatus(participantId);
  }

  @Post('effect')
  async applyEffect(@Body() effectDto: {
    sourceId: string;
    targetId: string;
    effectType: CombatEffectType;
    value: number;
    duration: number;
    interval?: number;
    metadata?: Record<string, any>;
  }) {
    return this.combatService.applyEffect(
      effectDto.sourceId,
      effectDto.targetId,
      effectDto.effectType,
      effectDto.value,
      effectDto.duration,
      effectDto.interval,
      effectDto.metadata,
    );
  }

  // Método original mantido para compatibilidade
  @Post('legacy-attack')
  async attack(@Body() attackDto: { attackerId: string; targetId: string }) {
    return this.combatService.attack(attackDto);
  }
}