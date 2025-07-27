import { Injectable, Inject } from '@nestjs/common';
import { Channel } from '../../domain/entities/channel.entity';
import { ChannelRepository, CHANNEL_REPOSITORY } from '../../domain/repositories/channel.repository';

@Injectable()
export class CreateChannelUseCase {
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channelRepository: ChannelRepository,
  ) {}

  async execute(
    name: string,
    description: string,
    ownerId: string,
    isPublic: boolean = true,
  ): Promise<Channel> {
    // Verificar se já existe um canal com o mesmo nome
    const exists = await this.channelRepository.exists(name);
    if (exists) {
      throw new Error(`Canal com o nome '${name}' já existe`);
    }

    // Criar o canal
    const channel = Channel.create(
      name,
      description,
      ownerId,
      isPublic,
    );

    // Salvar o canal
    await this.channelRepository.save(channel);

    return channel;
  }
}