import { Injectable, Inject } from '@nestjs/common';
import { Account } from '../../domain/entities/account.entity';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { ACCOUNT_REPOSITORY_TOKEN } from '../../domain/repositories/account.repository.token';
import { Password } from '../../domain/value-objects/password.vo';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(email: string, password: string): Promise<Account> {
    // Buscar conta pelo email
    const account = await this.accountRepository.findByEmail(email);
    if (!account) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar se a conta está ativa
    if (!account.isActive) {
      throw new Error('Conta inativa');
    }

    // Verificar senha
    const passwordVO = Password.fromHash(account.passwordHash);
    const isValidPassword = await passwordVO.verify(password);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    // Atualizar último login
    account.updateLastLogin();
    await this.accountRepository.save(account);

    return account;
  }
}
