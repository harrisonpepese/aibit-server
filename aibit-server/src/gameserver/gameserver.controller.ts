import { Controller, Get, Post, Body } from '@nestjs/common';
import { GameServerService } from './gameserver.service';

@Controller('gameserver')
export class GameServerController {
  constructor(private readonly gameServerService: GameServerService) {}

  @Get('status')
  getStatus() {
    return this.gameServerService.getStatus();
  }

  @Post('action')
  performAction(@Body() actionDto: any) {
    return this.gameServerService.performAction(actionDto);
  }
}