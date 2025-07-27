import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { MessageType } from '../domain/entities/message.entity';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000, { message: 'Conteúdo da mensagem muito longo (máximo 1000 caracteres)' })
  content: string;

  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  senderName: string;

  @IsNotEmpty()
  @IsString()
  type: MessageType;

  @IsOptional()
  @IsUUID()
  channelId?: string;

  @IsOptional()
  @IsUUID()
  recipientId?: string;
}