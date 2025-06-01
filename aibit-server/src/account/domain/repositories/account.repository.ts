import { Account } from '../entities/account.entity';

export interface AccountRepository {
  save(account: Account): Promise<void>;
  findById(id: string): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  delete(id: string): Promise<void>;
  exists(email: string): Promise<boolean>;
}
