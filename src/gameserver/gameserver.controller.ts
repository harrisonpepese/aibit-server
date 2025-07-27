import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { GameServerService } from './gameserver.service';

@Controller('gameserver')
export class GameServerController {
  constructor(private readonly gameServerService: GameServerService) {}

  @Get('status')
  async getStatus() {
    return this.gameServerService.getStatus();
  }

  @Post('action')
  async performAction(@Body() actionDto: any) {
    return this.gameServerService.performAction(actionDto);
  }

  @Get('world-state')
  async getWorldState() {
    return this.gameServerService.getGameState();
  }

  @Post('broadcast')
  async broadcastMessage(@Body() broadcastDto: { event: string; data: any; targetType?: string; targetIds?: string[] }) {
    const { event, data, targetType, targetIds } = broadcastDto;

    if (targetType === 'area' && targetIds?.length >= 4) {
      // Broadcast to area - targetIds format: [x, y, z, radius]
      const center = {
        x: parseInt(targetIds[0], 10),
        y: parseInt(targetIds[1], 10),
        z: parseInt(targetIds[2], 10)
      };
      const radius = parseInt(targetIds[3], 10);
      
      await this.gameServerService.broadcastToArea(event, data, center, radius);
      return { success: true, message: 'Broadcast to area sent' };
    } 
    else if (targetType === 'entities' && targetIds?.length > 0) {
      // Broadcast to specific entities
      await this.gameServerService.broadcastToEntities(event, data, targetIds);
      return { success: true, message: 'Broadcast to entities sent' };
    } 
    else {
      // Broadcast to all
      this.gameServerService.broadcastToAll(event, data);
      return { success: true, message: 'Broadcast to all clients sent' };
    }
  }
}