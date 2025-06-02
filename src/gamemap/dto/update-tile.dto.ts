import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { TileType } from '../domain/entities/tile.entity';

export class PositionDto {
  @IsInt()
  @Min(0)
  @Max(9999)
  x: number;

  @IsInt()
  @Min(0)
  @Max(9999)
  y: number;

  @IsInt()
  @Min(0)
  @Max(15)
  z: number;
}

export class UpdateTileDto {
  @IsNotEmpty()
  @IsString()
  mapId: string;

  @IsNotEmpty()
  position: PositionDto;

  @IsEnum(TileType)
  type: TileType;

  @IsOptional()
  walkable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(2.0)
  friction?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  damagePerTurn?: number;

  @IsOptional()
  teleportDestination?: PositionDto;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
