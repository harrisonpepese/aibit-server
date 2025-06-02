import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { DamageType, StatusEffect } from '../domain/entities/damage.entity';

export class DamageSourceDto {
  @IsString({ message: 'ID da fonte deve ser uma string' })
  sourceId: string;

  @IsString({ message: 'Nome da fonte deve ser uma string' })
  sourceName: string;

  @IsEnum(['character', 'creature', 'environment', 'spell', 'item'], {
    message: 'Tipo da fonte deve ser: character, creature, environment, spell ou item'
  })
  sourceType: 'character' | 'creature' | 'environment' | 'spell' | 'item';
}

export class StatusEffectDto {
  @IsEnum(StatusEffect, { message: 'Efeito de status inválido' })
  effect: StatusEffect;

  @IsNumber({}, { message: 'Duração deve ser um número' })
  @Min(1, { message: 'Duração deve ser pelo menos 1' })
  duration: number;

  @IsNumber({}, { message: 'Intensidade deve ser um número' })
  @Min(1, { message: 'Intensidade deve ser pelo menos 1' })
  intensity: number;

  @IsOptional()
  @IsString({ message: 'Fonte do efeito deve ser uma string' })
  source?: string;
}

export class DamageResistanceDto {
  @IsEnum(DamageType, { message: 'Tipo de dano inválido' })
  type: DamageType;

  @IsNumber({}, { message: 'Percentual deve ser um número' })
  @Min(0, { message: 'Percentual não pode ser negativo' })
  @Max(200, { message: 'Percentual não pode exceder 200' })
  percentage: number;
}

export class ApplyDamageDto {
  @IsString({ message: 'ID do alvo deve ser uma string' })
  targetId: string;

  @IsNumber({}, { message: 'Quantidade de dano deve ser um número' })
  @Min(0, { message: 'Quantidade de dano não pode ser negativa' })
  @Max(99999, { message: 'Quantidade de dano não pode exceder 99999' })
  amount: number;

  @IsEnum(DamageType, { message: 'Tipo de dano inválido' })
  type: DamageType;

  @ValidateNested()
  @Type(() => DamageSourceDto)
  source: DamageSourceDto;

  @IsOptional()
  @IsBoolean({ message: 'isCritical deve ser um boolean' })
  isCritical?: boolean;

  @IsOptional()
  @IsArray({ message: 'statusEffects deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => StatusEffectDto)
  statusEffects?: StatusEffectDto[];

  @IsOptional()
  @IsArray({ message: 'targetResistances deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => DamageResistanceDto)
  targetResistances?: DamageResistanceDto[];

  @IsOptional()
  @IsNumber({}, { message: 'Armadura do alvo deve ser um número' })
  @Min(0, { message: 'Armadura do alvo não pode ser negativa' })
  targetArmor?: number;
}
