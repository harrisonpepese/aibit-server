import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateCharacterDto {
  @IsString({ message: 'ID da conta deve ser uma string' })
  @IsNotEmpty({ message: 'ID da conta é obrigatório' })
  accountId: string;

  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(3, 20, { message: 'Nome deve ter entre 3 e 20 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, { 
    message: 'Nome deve conter apenas letras e espaços' 
  })
  name: string;
}
