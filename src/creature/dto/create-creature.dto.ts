import { IsString, IsOptional, IsInt, IsNotEmpty, Min, Max, IsBoolean, IsObject, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class PositionDto {
  @IsInt()
  @Min(0)
  @Max(5000)
  x: number;

  @IsInt()
  @Min(0)
  @Max(5000)
  y: number;

  @IsInt()
  @Min(0)
  @Max(15)
  z: number;
}

class CreatureTypeDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsBoolean()
  isBoss: boolean;

  @IsBoolean()
  isHostile: boolean;
}

class CreatureStatsDto {
  @IsInt()
  @Min(1)
  maxHealth: number;

  @IsInt()
  @Min(0)
  maxMana: number;

  @IsInt()
  @Min(0)
  attack: number;

  @IsInt()
  @Min(0)
  defense: number;

  @IsInt()
  @Min(1)
  @Max(10)
  speed: number;

  @IsInt()
  @Min(1)
  level: number;

  @IsInt()
  @Min(0)
  experience: number;
}

export class CreateCreatureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CreatureTypeDto)
  type: CreatureTypeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreatureStatsDto)
  stats: CreatureStatsDto;

  @IsString()
  @IsOptional()
  spawnId?: string;
}

export class CreateCreatureBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCreatureDto)
  creatures: CreateCreatureDto[];
}
