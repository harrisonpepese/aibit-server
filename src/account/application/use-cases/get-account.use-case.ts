import { Injectable, Inject } from '@nestjs/common';
import { Account } from '../../domain/entities/account.entity';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { ACCOUNT_REPOSITORY_TOKEN } from '../../domain/repositories/account.repository.token';

@Injectable()
export class GetAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(accountId: string): Promise<Account> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    return account;
  }
}
