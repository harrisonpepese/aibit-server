import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getAllMessages() {
    return this.chatService.getAllMessages();
  }

  @Post()
  sendMessage(@Body() message: { sender: string; content: string }) {
    return this.chatService.sendMessage(message.sender, message.content);
  }
}