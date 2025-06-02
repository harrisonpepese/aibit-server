import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { MovementType } from '../domain/entities/movement.entity';

export class PositionDto {
  @IsNumber()
  @Min(0)
  @Max(9999)
  x: number;

  @IsNumber()
  @Min(0)
  @Max(9999)
  y: number;

  @IsNumber()
  @Min(0)
  @Max(15)
  z: number;
}

export class MovementSourceDto {
  @IsString()
  @IsNotEmpty()
  sourceId: string;

  @IsString()
  @IsNotEmpty()
  sourceName: string;

  @IsString()
  @IsEnum(['character', 'creature', 'npc', 'system'])
  sourceType: 'character' | 'creature' | 'npc' | 'system';
}

export class ExecuteMovementDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ValidateNested()
  @Type(() => PositionDto)
  fromPosition: PositionDto;

  @ValidateNested()
  @Type(() => PositionDto)
  toPosition: PositionDto;

  @IsEnum(MovementType)
  movementType: MovementType;

  @ValidateNested()
  @Type(() => MovementSourceDto)
  source: MovementSourceDto;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(10)
  speed?: number;

  @IsOptional()
  validateMovement?: boolean;
}
