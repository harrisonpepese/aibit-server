import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateAccountDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @MaxLength(100, { message: 'Senha não pode ter mais de 100 caracteres' })
  password: string;
}
