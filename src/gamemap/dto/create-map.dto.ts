import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { TileType } from '../domain/entities/tile.entity';

export class CreateMapDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  @Max(10000)
  width: number;

  @IsInt()
  @IsPositive()
  @Max(10000)
  height: number;

  @IsInt()
  @IsPositive()
  @Max(16)
  @IsOptional()
  depth?: number;
}
