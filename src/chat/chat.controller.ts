import { Controller, Get, Post, Body, Param, Query, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
// DTOs
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { ChannelResponseDto } from './dto/channel-response.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Rotas para mensagens
  @Post('messages')
  async sendMessage(@Body() createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    try {
      return await this.chatService.sendMessage(createMessageDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao enviar mensagem';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('messages/global')
  async getGlobalMessages(@Query('limit') limit?: number): Promise<MessageResponseDto[]> {
    try {
      return await this.chatService.getGlobalMessages(limit);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar mensagens globais';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('messages/system')
  async getSystemMessages(@Query('limit') limit?: number): Promise<MessageResponseDto[]> {
    try {
      return await this.chatService.getSystemMessages(limit);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar mensagens do sistema';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('messages/private/:userId')
  async getPrivateMessages(
    @Param('userId') userId: string,
    @Query('limit') limit?: number
  ): Promise<MessageResponseDto[]> {
    try {
      return await this.chatService.getPrivateMessages(userId, limit);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar mensagens privadas';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('messages/user/:userId')
  async getUserMessages(
    @Param('userId') userId: string,
    @Query('limit') limit?: number
  ): Promise<MessageResponseDto[]> {
    try {
      return await this.chatService.getUserMessages(userId, limit);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar mensagens do usuário';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('messages/channel/:channelId')
  async getChannelMessages(
    @Param('channelId') channelId: string,
    @Query('limit') limit?: number
  ): Promise<MessageResponseDto[]> {
    try {
      return await this.chatService.getChannelMessages(channelId, limit);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar mensagens do canal';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('messages/recent')
  async getRecentMessages(@Query('limit') limit?: number): Promise<MessageResponseDto[]> {
    try {
      return await this.chatService.getRecentMessages(limit);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar mensagens recentes';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Rotas para canais
  @Post('channels')
  async createChannel(@Body() createChannelDto: CreateChannelDto): Promise<ChannelResponseDto> {
    try {
      return await this.chatService.createChannel(createChannelDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar canal';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('channels/public')
  async getPublicChannels(): Promise<ChannelResponseDto[]> {
    try {
      return await this.chatService.getPublicChannels();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar canais públicos';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('channels/user/:userId')
  async getUserChannels(@Param('userId') userId: string): Promise<ChannelResponseDto[]> {
    try {
      return await this.chatService.getUserChannels(userId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar canais do usuário';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('channels/:channelId')
  async getChannelById(@Param('channelId') channelId: string): Promise<ChannelResponseDto> {
    try {
      return await this.chatService.getChannelById(channelId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar canal';
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }
  }

  // Rotas para gerenciar membros de canais
  @Put('channels/:channelId/members/:userId')
  async addChannelMember(
    @Param('channelId') channelId: string,
    @Param('userId') userId: string,
    @Body('byUserId') byUserId: string
  ): Promise<void> {
    try {
      await this.chatService.addChannelMember(channelId, userId, byUserId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao adicionar membro ao canal';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('channels/:channelId/members/:userId')
  async removeChannelMember(
    @Param('channelId') channelId: string,
    @Param('userId') userId: string,
    @Body('byUserId') byUserId: string
  ): Promise<void> {
    try {
      await this.chatService.removeChannelMember(channelId, userId, byUserId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover membro do canal';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('channels/:channelId/moderators/:userId')
  async addChannelModerator(
    @Param('channelId') channelId: string,
    @Param('userId') userId: string,
    @Body('byUserId') byUserId: string
  ): Promise<void> {
    try {
      await this.chatService.addChannelModerator(channelId, userId, byUserId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao adicionar moderador ao canal';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('channels/:channelId/moderators/:userId')
  async removeChannelModerator(
    @Param('channelId') channelId: string,
    @Param('userId') userId: string,
    @Body('byUserId') byUserId: string
  ): Promise<void> {
    try {
      await this.chatService.removeChannelModerator(channelId, userId, byUserId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover moderador do canal';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }
}