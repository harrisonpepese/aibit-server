import { Injectable } from '@nestjs/common';
import { ChannelRepository } from '../../domain/repositories/channel.repository';
import { Channel } from '../../domain/entities/channel.entity';

@Injectable()
export class InMemoryChannelRepository implements ChannelRepository {
  private channels: Map<string, Channel> = new Map();

  async save(channel: Channel): Promise<void> {
    this.channels.set(channel.getId(), channel);
  }

  async findById(id: string): Promise<Channel | null> {
    return this.channels.get(id) || null;
  }

  async findByName(name: string): Promise<Channel | null> {
    return Array.from(this.channels.values())
      .find(channel => channel.getName().toLowerCase() === name.toLowerCase()) || null;
  }
  async findPublicChannels(): Promise<Channel[]> {
    return Array.from(this.channels.values())
      .filter(channel => channel.getIsPublic());
  }

  async findChannelsByMember(userId: string): Promise<Channel[]> {
    return Array.from(this.channels.values())
      .filter(channel => channel.isMember(userId));
  }

  async findChannelsByOwner(userId: string): Promise<Channel[]> {
    return Array.from(this.channels.values())
      .filter(channel => channel.getOwnerId() === userId);
  }

  async delete(id: string): Promise<void> {
    this.channels.delete(id);
  }

  async exists(name: string): Promise<boolean> {
    return Array.from(this.channels.values())
      .some(channel => channel.getName().toLowerCase() === name.toLowerCase());
  }
}