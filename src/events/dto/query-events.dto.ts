import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { GameEventType, GameEventStatus } from '../domain/entities/game-event.entity';

export class QueryEventsDto {
  @IsOptional()
  @IsEnum(GameEventType)
  type?: GameEventType;

  @IsOptional()
  @IsEnum(GameEventStatus)
  status?: GameEventStatus;

  @IsOptional()
  @IsString()
  sourceModule?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}

export class QueryAreaEventsDto {
  @IsNumber()
  @Type(() => Number)
  x: number;

  @IsNumber()
  @Type(() => Number)
  y: number;

  @IsNumber()
  @Type(() => Number)
  z: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  radius: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
