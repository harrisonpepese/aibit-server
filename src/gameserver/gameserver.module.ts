import { Module } from '@nestjs/common';
import { GameServerController } from './gameserver.controller';
import { GameServerService } from './gameserver.service';

@Module({
  controllers: [GameServerController],
  providers: [GameServerService],
})
export class GameServerModule {}