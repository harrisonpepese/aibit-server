import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateCharacterStatsDto {
  @IsOptional()
  @IsNumber({}, { message: 'Dano deve ser um número' })
  @Min(0, { message: 'Dano não pode ser negativo' })
  damage?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Cura deve ser um número' })
  @Min(0, { message: 'Cura não pode ser negativa' })
  healing?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Experiência deve ser um número' })
  @Min(0, { message: 'Experiência não pode ser negativa' })
  experience?: number;
}
