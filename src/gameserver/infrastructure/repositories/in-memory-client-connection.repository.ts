import { Injectable } from '@nestjs/common';
import { ClientConnection } from '../../domain/entities/client-connection.entity';
import { IClientConnectionRepository } from '../../domain/repositories/client-connection.repository.interface';

/**
 * In-memory implementation of client connection repository
 */
@Injectable()
export class InMemoryClientConnectionRepository implements IClientConnectionRepository {
  private connections: Map<string, ClientConnection> = new Map();
  
  async save(connection: ClientConnection): Promise<void> {
    this.connections.set(connection.getId(), connection);
  }
  
  async findById(id: string): Promise<ClientConnection | null> {
    return this.connections.get(id) || null;
  }
  
  async findByAccountId(accountId: string): Promise<ClientConnection[]> {
    return Array.from(this.connections.values())
      .filter(conn => conn.getAccountId() === accountId);
  }
  
  async findByCharacterId(characterId: string): Promise<ClientConnection | null> {
    for (const connection of this.connections.values()) {
      if (connection.getCharacterId() === characterId) {
        return connection;
      }
    }
    return null;
  }
  
  async findAll(): Promise<ClientConnection[]> {
    return Array.from(this.connections.values());
  }
  
  async delete(id: string): Promise<boolean> {
    return this.connections.delete(id);
  }
  
  async deleteByAccountId(accountId: string): Promise<number> {
    let count = 0;
    for (const [id, connection] of this.connections.entries()) {
      if (connection.getAccountId() === accountId) {
        this.connections.delete(id);
        count++;
      }
    }
    return count;
  }
  
  async updateActivity(id: string): Promise<boolean> {
    const connection = this.connections.get(id);
    if (connection) {
      connection.updateActivity();
      return true;
    }
    return false;
  }
  
  async findInactive(thresholdSeconds: number): Promise<ClientConnection[]> {
    const now = new Date();
    const inactiveConnections: ClientConnection[] = [];
    
    for (const connection of this.connections.values()) {
      const lastActivityTime = connection.getLastActivity().getTime();
      const inactiveTime = Math.floor((now.getTime() - lastActivityTime) / 1000);
      
      if (inactiveTime >= thresholdSeconds) {
        inactiveConnections.push(connection);
      }
    }
    
    return inactiveConnections;
  }
}
