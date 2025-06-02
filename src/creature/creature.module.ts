import { Module } from '@nestjs/common';
import { CreatureController } from './creature.controller';
import { CreatureService } from './creature.service';

@Module({
  controllers: [CreatureController],
  providers: [CreatureService],
})
export class CreatureModule {}