import { Injectable, Inject } from '@nestjs/common';
import { IClientConnectionRepository } from '../../domain/repositories/client-connection.repository.interface';
import { ClientConnection } from '../../domain/entities/client-connection.entity';

@Injectable()
export class ClientConnectionService {  constructor(
    @Inject('IClientConnectionRepository')
    private readonly clientConnectionRepository: IClientConnectionRepository
  ) {}

  /**
   * Creates a new client connection and stores it
   */
  async createConnection(
    accountId: string | null,
    clientIp: string,
    userAgent: string,
    metadata: Record<string, any> = {}
  ): Promise<ClientConnection> {
    const connection = new ClientConnection(accountId, clientIp, userAgent, metadata);
    await this.clientConnectionRepository.save(connection);
    return connection;
  }

  /**
   * Gets a client connection by ID
   */
  async getConnectionById(id: string): Promise<ClientConnection | null> {
    return this.clientConnectionRepository.findById(id);
  }

  /**
   * Gets all connections for a specific account
   */
  async getConnectionsByAccountId(accountId: string): Promise<ClientConnection[]> {
    return this.clientConnectionRepository.findByAccountId(accountId);
  }

  /**
   * Gets a connection for a specific character
   */
  async getConnectionByCharacterId(characterId: string): Promise<ClientConnection | null> {
    return this.clientConnectionRepository.findByCharacterId(characterId);
  }

  /**
   * Updates a client connection's character ID
   */
  async updateCharacterId(connectionId: string, characterId: string | null): Promise<boolean> {
    const connection = await this.clientConnectionRepository.findById(connectionId);
    if (connection) {
      connection.setCharacterId(characterId);
      await this.clientConnectionRepository.save(connection);
      return true;
    }
    return false;
  }

  /**
   * Updates a client connection's activity timestamp
   */
  async updateActivity(connectionId: string): Promise<boolean> {
    return this.clientConnectionRepository.updateActivity(connectionId);
  }

  /**
   * Sets a client connection's active status
   */
  async setActive(connectionId: string, active: boolean): Promise<boolean> {
    const connection = await this.clientConnectionRepository.findById(connectionId);
    if (connection) {
      connection.setActive(active);
      await this.clientConnectionRepository.save(connection);
      return true;
    }
    return false;
  }

  /**
   * Removes a client connection
   */
  async removeConnection(connectionId: string): Promise<boolean> {
    return this.clientConnectionRepository.delete(connectionId);
  }

  /**
   * Gets all inactive connections based on a threshold
   */
  async getInactiveConnections(thresholdSeconds: number): Promise<ClientConnection[]> {
    return this.clientConnectionRepository.findInactive(thresholdSeconds);
  }

  /**
   * Gets all active client connections
   */
  async getAllConnections(): Promise<ClientConnection[]> {
    const connections = await this.clientConnectionRepository.findAll();
    return connections.filter(conn => conn.isActive());
  }
}
