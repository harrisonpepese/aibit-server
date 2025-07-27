import { Injectable, Inject } from '@nestjs/common';
import { ChannelRepository, CHANNEL_REPOSITORY } from '../../domain/repositories/channel.repository';
import { MessageRepository, MESSAGE_REPOSITORY } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';

@Injectable()
export class ManageChannelMembersUseCase {
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channelRepository: ChannelRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
  ) {}

  async addMember(channelId: string, userId: string, byUserId: string): Promise<void> {
    const channel = await this.channelRepository.findById(channelId);
    if (!channel) {
      throw new Error('Canal não encontrado');
    }

    // Verificar se o usuário solicitante tem permissão
    if (!channel.isModerator(byUserId) && channel.getOwnerId() !== byUserId) {
      throw new Error('Você não tem permissão para adicionar membros a este canal');
    }

    // Adicionar o membro
    channel.addMember(userId);
    
    // Salvar o canal atualizado
    await this.channelRepository.save(channel);

    // Criar mensagem de sistema para o canal
    const systemMessage = Message.create(
      'system',
      'Sistema',
      `Um novo membro foi adicionado ao canal`,
      'CHANNEL',
      channelId,
    );

    await this.messageRepository.save(systemMessage);
  }

  async removeMember(channelId: string, userId: string, byUserId: string): Promise<void> {
    const channel = await this.channelRepository.findById(channelId);
    if (!channel) {
      throw new Error('Canal não encontrado');
    }

    // Não pode remover o dono do canal
    if (channel.getOwnerId() === userId) {
      throw new Error('Não é possível remover o dono do canal');
    }

    // Verificar se o usuário solicitante tem permissão
    if (!channel.isModerator(byUserId) && channel.getOwnerId() !== byUserId && byUserId !== userId) {
      throw new Error('Você não tem permissão para remover membros deste canal');
    }

    // Remover o membro
    channel.removeMember(userId);
    
    // Se o usuário era um moderador, removê-lo dessa função também
    if (channel.isModerator(userId)) {
      channel.removeModerator(userId);
    }
    
    // Salvar o canal atualizado
    await this.channelRepository.save(channel);

    // Criar mensagem de sistema para o canal
    const systemMessage = Message.create(
      'system',
      'Sistema',
      `Um membro foi removido do canal`,
      'CHANNEL',
      channelId,
    );

    await this.messageRepository.save(systemMessage);
  }

  async addModerator(channelId: string, userId: string, byUserId: string): Promise<void> {
    const channel = await this.channelRepository.findById(channelId);
    if (!channel) {
      throw new Error('Canal não encontrado');
    }

    // Apenas o dono pode adicionar moderadores
    if (channel.getOwnerId() !== byUserId) {
      throw new Error('Apenas o dono do canal pode adicionar moderadores');
    }

    // Verificar se o usuário é membro do canal
    if (!channel.isMember(userId)) {
      throw new Error('O usuário precisa ser membro do canal para ser promovido a moderador');
    }

    // Adicionar o moderador
    channel.addModerator(userId);
    
    // Salvar o canal atualizado
    await this.channelRepository.save(channel);

    // Criar mensagem de sistema para o canal
    const systemMessage = Message.create(
      'system',
      'Sistema',
      `Um novo moderador foi adicionado ao canal`,
      'CHANNEL',
      channelId,
    );

    await this.messageRepository.save(systemMessage);
  }

  async removeModerator(channelId: string, userId: string, byUserId: string): Promise<void> {
    const channel = await this.channelRepository.findById(channelId);
    if (!channel) {
      throw new Error('Canal não encontrado');
    }

    // Apenas o dono pode remover moderadores
    if (channel.getOwnerId() !== byUserId) {
      throw new Error('Apenas o dono do canal pode remover moderadores');
    }

    // Não pode remover o dono da lista de moderadores
    if (channel.getOwnerId() === userId) {
      throw new Error('Não é possível remover o dono da lista de moderadores');
    }

    // Remover o moderador
    channel.removeModerator(userId);
    
    // Salvar o canal atualizado
    await this.channelRepository.save(channel);

    // Criar mensagem de sistema para o canal
    const systemMessage = Message.create(
      'system',
      'Sistema',
      `Um moderador foi removido do canal`,
      'CHANNEL',
      channelId,
    );

    await this.messageRepository.save(systemMessage);
  }
}