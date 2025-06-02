import { Injectable } from '@nestjs/common';
import { ApplyDamageUseCase } from './application/use-cases/apply-damage.use-case';
import { GetDamageStatisticsUseCase } from './application/use-cases/get-damage-statistics.use-case';
import { GetDamageHistoryUseCase } from './application/use-cases/get-damage-history.use-case';
import { ApplyDamageDto } from './dto/apply-damage.dto';
import { ApplyDamageResponseDto, DamageResponseDto, DamageStatisticsResponseDto } from './dto/damage-response.dto';

@Injectable()
export class DamageService {
  constructor(
    private readonly applyDamageUseCase: ApplyDamageUseCase,
    private readonly getDamageStatisticsUseCase: GetDamageStatisticsUseCase,
    private readonly getDamageHistoryUseCase: GetDamageHistoryUseCase,
  ) {}

  async applyDamage(applyDamageDto: ApplyDamageDto): Promise<ApplyDamageResponseDto> {
    const result = await this.applyDamageUseCase.execute(applyDamageDto);
    return new ApplyDamageResponseDto(result);
  }

  async getDamageStatistics(entityId: string): Promise<DamageStatisticsResponseDto> {
    const stats = await this.getDamageStatisticsUseCase.getStatisticsForEntity(entityId);
    return new DamageStatisticsResponseDto(stats);
  }

  async getRecentStatistics(entityId: string, minutes: number): Promise<DamageStatisticsResponseDto> {
    const stats = await this.getDamageStatisticsUseCase.getRecentStatistics(entityId, minutes);
    return new DamageStatisticsResponseDto(stats);
  }

  async getDamageHistory(entityId: string, limit?: number): Promise<DamageResponseDto[]> {
    const damages = await this.getDamageHistoryUseCase.getDamageDealtBy(entityId, limit);
    return damages.map(damage => new DamageResponseDto(damage));
  }

  async getDamageReceived(targetId: string, limit?: number): Promise<DamageResponseDto[]> {
    const damages = await this.getDamageHistoryUseCase.getDamageReceivedBy(targetId, limit);
    return damages.map(damage => new DamageResponseDto(damage));
  }

  async getRecentDamage(targetId: string, minutes: number): Promise<DamageResponseDto[]> {
    const damages = await this.getDamageHistoryUseCase.getRecentDamage(targetId, minutes);
    return damages.map(damage => new DamageResponseDto(damage));
  }

  async getDamageById(id: string): Promise<DamageResponseDto> {
    const damage = await this.getDamageHistoryUseCase.getDamageById(id);
    return new DamageResponseDto(damage);
  }

  async getDamageInTimeRange(
    startTime: Date,
    endTime: Date,
    entityId?: string,
  ): Promise<DamageResponseDto[]> {
    const damages = await this.getDamageHistoryUseCase.getDamageInTimeRange(startTime, endTime, entityId);
    return damages.map(damage => new DamageResponseDto(damage));
  }
}