import { IsNumber, Min, Max, IsInt } from 'class-validator';

export class UpdateCharacterPositionDto {
  @IsNumber({}, { message: 'Coordenada X deve ser um número' })
  @IsInt({ message: 'Coordenada X deve ser um número inteiro' })
  @Min(0, { message: 'Coordenada X não pode ser negativa' })
  @Max(2048, { message: 'Coordenada X deve estar dentro dos limites do mapa' })
  x: number;

  @IsNumber({}, { message: 'Coordenada Y deve ser um número' })
  @IsInt({ message: 'Coordenada Y deve ser um número inteiro' })
  @Min(0, { message: 'Coordenada Y não pode ser negativa' })
  @Max(2048, { message: 'Coordenada Y deve estar dentro dos limites do mapa' })
  y: number;

  @IsNumber({}, { message: 'Coordenada Z deve ser um número' })
  @IsInt({ message: 'Coordenada Z deve ser um número inteiro' })
  @Min(0, { message: 'Coordenada Z não pode ser negativa' })
  @Max(15, { message: 'Coordenada Z deve estar dentro dos limites do mapa' })
  z: number;
}
