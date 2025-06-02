import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { DamageService } from './damage.service';
import { ApplyDamageDto } from './dto/apply-damage.dto';
import { ApplyDamageResponseDto, DamageResponseDto, DamageStatisticsResponseDto } from './dto/damage-response.dto';

@Controller('damage')
export class DamageController {
  constructor(private readonly damageService: DamageService) {}

  @Post('apply')
  async applyDamage(@Body() applyDamageDto: ApplyDamageDto): Promise<ApplyDamageResponseDto> {
    return this.damageService.applyDamage(applyDamageDto);
  }

  @Get('statistics/:entityId')
  async getDamageStatistics(@Param('entityId') entityId: string): Promise<DamageStatisticsResponseDto> {
    return this.damageService.getDamageStatistics(entityId);
  }

  @Get('statistics/:entityId/recent')
  async getRecentStatistics(
    @Param('entityId') entityId: string,
    @Query('minutes', ParseIntPipe) minutes: number = 60,
  ): Promise<DamageStatisticsResponseDto> {
    if (minutes <= 0 || minutes > 1440) { // Max 24 hours
      throw new BadRequestException('Minutes must be between 1 and 1440');
    }
    return this.damageService.getRecentStatistics(entityId, minutes);
  }

  @Get('history/:entityId/dealt')
  async getDamageHistory(
    @Param('entityId') entityId: string,
    @Query('limit') limit?: string,
  ): Promise<DamageResponseDto[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    if (parsedLimit !== undefined && (parsedLimit <= 0 || parsedLimit > 1000)) {
      throw new BadRequestException('Limit must be between 1 and 1000');
    }
    return this.damageService.getDamageHistory(entityId, parsedLimit);
  }

  @Get('history/:targetId/received')
  async getDamageReceived(
    @Param('targetId') targetId: string,
    @Query('limit') limit?: string,
  ): Promise<DamageResponseDto[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    if (parsedLimit !== undefined && (parsedLimit <= 0 || parsedLimit > 1000)) {
      throw new BadRequestException('Limit must be between 1 and 1000');
    }
    return this.damageService.getDamageReceived(targetId, parsedLimit);
  }

  @Get('recent/:targetId')
  async getRecentDamage(
    @Param('targetId') targetId: string,
    @Query('minutes', ParseIntPipe) minutes: number = 5,
  ): Promise<DamageResponseDto[]> {
    if (minutes <= 0 || minutes > 60) {
      throw new BadRequestException('Minutes must be between 1 and 60');
    }
    return this.damageService.getRecentDamage(targetId, minutes);
  }

  @Get('range')
  async getDamageInTimeRange(
    @Query('startTime') startTimeStr: string,
    @Query('endTime') endTimeStr: string,
    @Query('entityId') entityId?: string,
  ): Promise<DamageResponseDto[]> {
    if (!startTimeStr || !endTimeStr) {
      throw new BadRequestException('Both startTime and endTime are required');
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new BadRequestException('Invalid date format. Use ISO 8601 format');
    }

    if (startTime >= endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }

    // Limit range to 7 days
    const maxRange = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    if (endTime.getTime() - startTime.getTime() > maxRange) {
      throw new BadRequestException('Time range cannot exceed 7 days');
    }

    return this.damageService.getDamageInTimeRange(startTime, endTime, entityId);
  }

  @Get(':id')
  async getDamageById(@Param('id') id: string): Promise<DamageResponseDto> {
    return this.damageService.getDamageById(id);
  }
}