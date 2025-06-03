import { Channel } from '../entities/channel.entity';

export interface ChannelRepository {
  save(channel: Channel): Promise<void>;
  findById(id: string): Promise<Channel | null>;
  findByName(name: string): Promise<Channel | null>;
  findPublicChannels(): Promise<Channel[]>;
  findChannelsByMember(userId: string): Promise<Channel[]>;
  findChannelsByOwner(userId: string): Promise<Channel[]>;
  delete(id: string): Promise<void>;
  exists(name: string): Promise<boolean>;
}

export const CHANNEL_REPOSITORY = 'CHANNEL_REPOSITORY';
