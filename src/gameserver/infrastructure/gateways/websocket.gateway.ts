import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  OnGatewayInit,
  WsResponse,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { GameServerService } from '../../gameserver.service';
import { ClientConnection } from '../../domain/entities/client-connection.entity';
import { AuthService } from '../../../account/application/use-cases/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'game',
})
@Injectable()
export class GameWebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() 
  server: Server;
  
  private readonly logger = new Logger(GameWebSocketGateway.name);
  private readonly clientConnections = new Map<string, ClientConnection>();

  constructor(
    private readonly gameServerService: GameServerService,
    private readonly authService: AuthService
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.query.token;
      
      // Extract connection metadata
      const clientIp = client.handshake.address;
      const userAgent = client.handshake.headers['user-agent'] || 'Unknown';

      if (!token) {
        // Allow anonymous connection but mark it as not authenticated
        const connection = new ClientConnection(
          null,
          clientIp,
          userAgent,
          { authenticated: false, anonymous: true }
        );
        
        this.clientConnections.set(client.id, connection);
        this.gameServerService.registerClient(client.id, client);
        
        this.logger.log(`Anonymous client connected: ${client.id}`);
        client.emit('connection_status', { 
          status: 'connected', 
          authenticated: false,
          message: 'Connected anonymously. Authentication required for game actions.'
        });
        
        return;
      }

      // Verify token and get account information
      const account = await this.authService.validateToken(token);
      
      if (!account) {
        client.emit('error', { message: 'Invalid authentication token' });
        client.disconnect();
        return;
      }

      // Create client connection entity
      const connection = new ClientConnection(
        account.id,
        clientIp,
        userAgent,
        { authenticated: true, username: account.username }
      );
      
      this.clientConnections.set(client.id, connection);
      this.gameServerService.registerClient(client.id, client);
      
      this.logger.log(`Client connected: ${client.id} (Account: ${account.username})`);
      client.emit('connection_status', { 
        status: 'connected', 
        authenticated: true,
        accountId: account.id,
        username: account.username
      });
      
    } catch (error) {
      this.logger.error(`Error during client connection: ${error.message}`, error.stack);
      client.emit('error', { message: 'Connection error' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const connection = this.clientConnections.get(client.id);
    if (connection) {
      this.logger.log(`Client disconnected: ${client.id}`);
      this.clientConnections.delete(client.id);
      this.gameServerService.removeClient(client.id);
    }
  }

  @SubscribeMessage('select_character')
  handleSelectCharacter(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { characterId: string }
  ): WsResponse<any> {
    try {
      const connection = this.clientConnections.get(client.id);
      if (!connection) {
        return { event: 'error', data: { message: 'Connection not found' } };
      }
      
      if (!connection.getAccountId()) {
        return { event: 'error', data: { message: 'Not authenticated' } };
      }
      
      // Set the character ID in the connection
      connection.setCharacterId(data.characterId);
      
      // Here we would validate if the character belongs to the account
      // and load initial character data
      
      return { 
        event: 'character_selected',
        data: { 
          characterId: data.characterId,
          message: 'Character selected successfully'
        } 
      };
    } catch (error) {
      this.logger.error(`Error selecting character: ${error.message}`, error.stack);
      return { event: 'error', data: { message: 'Error selecting character' } };
    }
  }

  @SubscribeMessage('game_action')
  handleGameAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any
  ): WsResponse<any> {
    try {
      const connection = this.clientConnections.get(client.id);
      if (!connection) {
        return { event: 'error', data: { message: 'Connection not found' } };
      }
      
      if (!connection.getAccountId() || !connection.getCharacterId()) {
        return { event: 'error', data: { message: 'Authentication or character selection required' } };
      }
      
      // Update last activity
      connection.updateActivity();
      
      // Process the game action
      // This would be forwarded to the appropriate service based on action type
      const result = this.gameServerService.processGameAction({
        clientId: client.id,
        accountId: connection.getAccountId(),
        characterId: connection.getCharacterId(),
        action: data
      });
      
      return { 
        event: 'action_result',
        data: result
      };
    } catch (error) {
      this.logger.error(`Error processing game action: ${error.message}`, error.stack);
      return { event: 'error', data: { message: 'Error processing game action' } };
    }
  }

  // Method to send updates to clients
  sendToClient(clientId: string, event: string, data: any): boolean {
    try {
      const client = this.server.sockets.sockets.get(clientId);
      if (client) {
        client.emit(event, data);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Error sending to client ${clientId}: ${error.message}`, error.stack);
      return false;
    }
  }

  // Method to broadcast to all clients
  broadcastToAll(event: string, data: any): void {
    try {
      this.server.emit(event, data);
    } catch (error) {
      this.logger.error(`Error broadcasting to all clients: ${error.message}`, error.stack);
    }
  }
}
