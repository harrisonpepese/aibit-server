import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { AttackType, DamageType } from '../domain/entities/attack.entity';

export class PerformAttackDto {
  @IsNotEmpty()
  @IsString()
  attackerId: string;

  @IsNotEmpty()
  @IsString()
  targetId: string;

  @IsNotEmpty()
  @IsEnum(AttackType)
  attackType: AttackType;

  @IsNotEmpty()
  @IsEnum(DamageType)
  damageType: DamageType;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  baseDamage: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  targetDodgeChance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  targetBlockChance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  targetResistance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  criticalChance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  accuracy?: number;
}
