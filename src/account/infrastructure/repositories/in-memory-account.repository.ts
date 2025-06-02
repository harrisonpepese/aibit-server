import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { Account } from '../../domain/entities/account.entity';

@Injectable()
export class InMemoryAccountRepository implements AccountRepository {
  private accounts: Map<string, Account> = new Map();

  async save(account: Account): Promise<void> {
    this.accounts.set(account.id, account);
  }

  async findById(id: string): Promise<Account | null> {
    return this.accounts.get(id) || null;
  }

  async findByEmail(email: string): Promise<Account | null> {
    for (const account of this.accounts.values()) {
      if (account.email === email) {
        return account;
      }
    }
    return null;
  }

  async delete(id: string): Promise<void> {
    this.accounts.delete(id);
  }

  async exists(email: string): Promise<boolean> {
    const account = await this.findByEmail(email);
    return account !== null;
  }
}
