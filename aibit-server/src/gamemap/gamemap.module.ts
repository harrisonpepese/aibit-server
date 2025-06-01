import { Module } from '@nestjs/common';
import { GameMapController } from './gamemap.controller';
import { GameMapService } from './gamemap.service';

@Module({
  controllers: [GameMapController],
  providers: [GameMapService],
})
export class GameMapModule {}