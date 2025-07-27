import { Injectable, Inject } from '@nestjs/common';
import { Channel } from '../../domain/entities/channel.entity';
import { ChannelRepository, CHANNEL_REPOSITORY } from '../../domain/repositories/channel.repository';

@Injectable()
export class GetChannelsUseCase {
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channelRepository: ChannelRepository,
  ) {}

  async getPublicChannels(): Promise<Channel[]> {
    return this.channelRepository.findPublicChannels();
  }

  async getUserChannels(userId: string): Promise<Channel[]> {
    return this.channelRepository.findChannelsByMember(userId);
  }

  async getOwnedChannels(userId: string): Promise<Channel[]> {
    return this.channelRepository.findChannelsByOwner(userId);
  }

  async getChannelById(channelId: string): Promise<Channel> {
    const channel = await this.channelRepository.findById(channelId);
    if (!channel) {
      throw new Error('Canal não encontrado');
    }
    return channel;
  }

  async getChannelByName(name: string): Promise<Channel> {
    const channel = await this.channelRepository.findByName(name);
    if (!channel) {
      throw new Error(`Canal '${name}' não encontrado`);
    }
    return channel;
  }
}