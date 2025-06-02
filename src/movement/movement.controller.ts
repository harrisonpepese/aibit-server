import { Controller, Post, Get, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { MovementService } from './movement.service';
import { ExecuteMovementDto } from './dto/execute-movement.dto';
import { 
  MovementResultResponseDto, 
  MovementResponseDto, 
  MovementStatisticsResponseDto,
  EntityPositionInfoResponseDto 
} from './dto/movement-response.dto';

@Controller('movement')
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @Post('execute')
  async executeMovement(@Body() executeMovementDto: ExecuteMovementDto): Promise<MovementResultResponseDto> {
    return await this.movementService.executeMovement(executeMovementDto);
  }

  @Get('entity/:entityId')
  async getMovementsByEntity(
    @Param('entityId') entityId: string,
    @Query('limit', ParseIntPipe) limit?: number,
  ): Promise<MovementResponseDto[]> {
    return await this.movementService.getMovementsByEntity(entityId, limit);
  }

  @Get('entity/:entityId/recent')
  async getRecentMovements(
    @Param('entityId') entityId: string,
    @Query('minutes', ParseIntPipe) minutes?: number,
  ): Promise<MovementResponseDto[]> {
    return await this.movementService.getRecentMovements(entityId, minutes);
  }

  @Get('entity/:entityId/path')
  async getMovementPath(
    @Param('entityId') entityId: string,
    @Query('limit', ParseIntPipe) limit?: number,
  ): Promise<MovementResponseDto[]> {
    return await this.movementService.getMovementPath(entityId, limit);
  }

  @Get('entity/:entityId/last')
  async getLastMovement(@Param('entityId') entityId: string): Promise<MovementResponseDto | null> {
    return await this.movementService.getLastMovement(entityId);
  }

  @Get('entity/:entityId/position')
  async getEntityPosition(@Param('entityId') entityId: string): Promise<EntityPositionInfoResponseDto> {
    return await this.movementService.getEntityPositionInfo(entityId);
  }

  @Get('entity/:entityId/statistics')
  async getEntityStatistics(@Param('entityId') entityId: string): Promise<MovementStatisticsResponseDto> {
    return await this.movementService.getEntityStatistics(entityId);
  }

  @Get('position/:x/:y/:z/to')
  async getMovementsToPosition(
    @Param('x', ParseIntPipe) x: number,
    @Param('y', ParseIntPipe) y: number,
    @Param('z', ParseIntPipe) z: number,
  ): Promise<MovementResponseDto[]> {
    return await this.movementService.getMovementsToPosition(x, y, z);
  }

  @Get('position/:x/:y/:z/from')
  async getMovementsFromPosition(
    @Param('x', ParseIntPipe) x: number,
    @Param('y', ParseIntPipe) y: number,
    @Param('z', ParseIntPipe) z: number,
  ): Promise<MovementResponseDto[]> {
    return await this.movementService.getMovementsFromPosition(x, y, z);
  }

  @Get('area/:startX/:startY/:endX/:endY/:z')
  async getMovementsInArea(
    @Param('startX', ParseIntPipe) startX: number,
    @Param('startY', ParseIntPipe) startY: number,
    @Param('endX', ParseIntPipe) endX: number,
    @Param('endY', ParseIntPipe) endY: number,
    @Param('z', ParseIntPipe) z: number,
  ): Promise<MovementResponseDto[]> {
    return await this.movementService.getMovementsInArea(startX, startY, endX, endY, z);
  }

  @Get('range/:x/:y/:z/:range/entities')
  async getEntitiesInRange(
    @Param('x', ParseIntPipe) x: number,
    @Param('y', ParseIntPipe) y: number,
    @Param('z', ParseIntPipe) z: number,
    @Param('range', ParseIntPipe) range: number,
  ): Promise<string[]> {
    return await this.movementService.getEntitiesInRange(x, y, z, range);
  }

  @Get('statistics/global')
  async getGlobalStatistics(
    @Query('timeRangeMinutes', ParseIntPipe) timeRangeMinutes?: number,
  ): Promise<MovementStatisticsResponseDto> {
    return await this.movementService.getGlobalStatistics(timeRangeMinutes);
  }

  @Get(':id')
  async getMovementById(@Param('id') id: string): Promise<MovementResponseDto> {
    return await this.movementService.getMovementById(id);
  }

  @Delete(':id')
  async deleteMovement(@Param('id') id: string): Promise<{ message: string }> {
    await this.movementService.deleteMovement(id);
    return { message: 'Movimento deletado com sucesso' };
  }

  @Delete('entity/:entityId/all')
  async deleteMovementsByEntity(@Param('entityId') entityId: string): Promise<{ message: string; deletedCount: number }> {
    const deletedCount = await this.movementService.deleteMovementsByEntity(entityId);
    return { 
      message: 'Movimentos da entidade deletados com sucesso',
      deletedCount 
    };
  }

  @Delete('old/:days')
  async deleteOldMovements(@Param('days', ParseIntPipe) days: number): Promise<{ message: string; deletedCount: number }> {
    const deletedCount = await this.movementService.deleteOldMovements(days);
    return { 
      message: 'Movimentos antigos deletados com sucesso',
      deletedCount 
    };
  }
}