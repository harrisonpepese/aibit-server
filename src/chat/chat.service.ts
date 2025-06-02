import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
    private messages: string[] = [];

    sendMessage(message: string): void {
        this.messages.push(message);
    }

    getMessages(): string[] {
        return this.messages;
    }
}