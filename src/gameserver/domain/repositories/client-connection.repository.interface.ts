import { ClientConnection } from '../entities/client-connection.entity';

/**
 * Interface for client connection repository
 */
export interface IClientConnectionRepository {
  save(connection: ClientConnection): Promise<void>;
  findById(id: string): Promise<ClientConnection | null>;
  findByAccountId(accountId: string): Promise<ClientConnection[]>;
  findByCharacterId(characterId: string): Promise<ClientConnection | null>;
  findAll(): Promise<ClientConnection[]>;
  delete(id: string): Promise<boolean>;
  deleteByAccountId(accountId: string): Promise<number>;
  updateActivity(id: string): Promise<boolean>;
  findInactive(thresholdSeconds: number): Promise<ClientConnection[]>;
}
