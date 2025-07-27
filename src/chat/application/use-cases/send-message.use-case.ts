import { Injectable, Inject } from '@nestjs/common';
import { Message, MessageType } from '../../domain/entities/message.entity';
import { MessageRepository, MESSAGE_REPOSITORY } from '../../domain/repositories/message.repository';
import { ChannelRepository, CHANNEL_REPOSITORY } from '../../domain/repositories/channel.repository';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(CHANNEL_REPOSITORY)
    private readonly channelRepository: ChannelRepository,
  ) {}

  async execute(
    senderId: string,
    senderName: string,
    content: string,
    type: MessageType,
    channelId?: string,
    recipientId?: string,
  ): Promise<Message> {
    // Para mensagens de canal, verificar se o canal existe e se o usuário é membro
    if (type === 'CHANNEL' && channelId) {
      const channel = await this.channelRepository.findById(channelId);
      if (!channel) {
        throw new Error('Canal não encontrado');
      }

      if (!channel.isMember(senderId)) {
        throw new Error('Você não é membro deste canal');
      }
    }

    // Criar a mensagem
    const message = Message.create(
      senderId,
      senderName,
      content,
      type,
      channelId,
      recipientId,
    );

    // Salvar a mensagem
    await this.messageRepository.save(message);

    return message;
  }
}