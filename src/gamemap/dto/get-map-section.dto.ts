import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class GetMapSectionDto {
  @IsNotEmpty()
  @IsString()
  mapId: string;

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

  @IsInt()
  @Min(1)
  @Max(50) // Limitando o raio para evitar sobrecarga
  radius: number;
}
