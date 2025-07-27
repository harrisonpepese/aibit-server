import { IsString, IsOptional, IsInt, Min, Max, IsObject, ValidateNested } from 'class-validator';
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

export class UpdateCreaturePositionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;
}

export class UpdateCreatureStatsDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  maxHealth?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  maxMana?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  attack?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  defense?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  speed?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  level?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  experience?: number;
}

export class ApplyDamageDto {
  @IsInt()
  @Min(1)
  amount: number;
}

export class HealCreatureDto {
  @IsInt()
  @Min(1)
  amount: number;
}

export class UseManaDto {
  @IsInt()
  @Min(1)
  amount: number;
}

export class AddStatusEffectDto {
  @IsString()
  type: string;
  
  @IsInt()
  @Min(1)
  duration: number;
  
  @IsInt()
  @Min(1)
  @Max(10)
  intensity: number;
}

export class RemoveStatusEffectDto {
  @IsString()
  type: string;
}
