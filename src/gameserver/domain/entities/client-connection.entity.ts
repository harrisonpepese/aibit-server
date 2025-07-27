import { v4 as uuidv4 } from 'uuid';

/**
 * Classe que representa uma conexão de cliente com o servidor de jogo.
 * Mantém informações sobre o cliente conectado e seu estado.
 */
export class ClientConnection {
  private readonly id: string;
  private readonly accountId: string | null;
  private characterId: string | null;
  private readonly connectionTime: Date;
  private lastActivity: Date;
  private clientIp: string;
  private userAgent: string;
  private active: boolean;
  private metadata: Record<string, any>;

  constructor(
    accountId: string | null,
    clientIp: string,
    userAgent: string,
    metadata: Record<string, any> = {},
  ) {
    this.id = uuidv4();
    this.accountId = accountId;
    this.characterId = null;
    this.connectionTime = new Date();
    this.lastActivity = new Date();
    this.clientIp = clientIp;
    this.userAgent = userAgent;
    this.active = true;
    this.metadata = { ...metadata };
  }

  getId(): string {
    return this.id;
  }

  getAccountId(): string | null {
    return this.accountId;
  }

  getCharacterId(): string | null {
    return this.characterId;
  }

  setCharacterId(characterId: string | null): void {
    this.characterId = characterId;
    this.updateActivity();
  }

  getConnectionTime(): Date {
    return new Date(this.connectionTime);
  }

  getLastActivity(): Date {
    return new Date(this.lastActivity);
  }

  updateActivity(): void {
    this.lastActivity = new Date();
  }

  getClientIp(): string {
    return this.clientIp;
  }

  getUserAgent(): string {
    return this.userAgent;
  }

  isActive(): boolean {
    return this.active;
  }

  setActive(active: boolean): void {
    this.active = active;
    this.updateActivity();
  }

  getMetadata(): Record<string, any> {
    return { ...this.metadata };
  }

  updateMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.updateActivity();
  }

  /**
   * Calcula quanto tempo o cliente está conectado em segundos
   */
  getConnectionDuration(): number {
    const now = new Date();
    return Math.round((now.getTime() - this.connectionTime.getTime()) / 1000);
  }

  /**
   * Calcula quanto tempo se passou desde a última atividade em segundos
   */
  getInactivityDuration(): number {
    const now = new Date();
    return Math.round((now.getTime() - this.lastActivity.getTime()) / 1000);
  }

  /**
   * Converte a entidade para um objeto plano
   */
  toJSON() {
    return {
      id: this.id,
      accountId: this.accountId,
      characterId: this.characterId,
      connectionTime: this.connectionTime.toISOString(),
      lastActivity: this.lastActivity.toISOString(),
      clientIp: this.clientIp,
      userAgent: this.userAgent,
      active: this.active,
      metadata: this.metadata,
    };
  }
}
