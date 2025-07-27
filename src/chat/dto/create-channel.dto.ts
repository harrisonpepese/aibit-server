import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'Nome do canal muito longo (máximo 50 caracteres)' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Descrição do canal muito longa (máximo 500 caracteres)' })
  description: string;

  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}