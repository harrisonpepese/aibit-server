import { Injectable, Inject } from '@nestjs/common';
import { Account } from '../../domain/entities/account.entity';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { ACCOUNT_REPOSITORY_TOKEN } from '../../domain/repositories/account.repository.token';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(email: string, password: string): Promise<Account> {
    // Validar se email já existe
    const emailExists = await this.accountRepository.exists(email);
    if (emailExists) {
      throw new Error('Email já está em uso');
    }

    // Criar value objects
    const emailVO = new Email(email);
    const passwordVO = new Password(password);

    // Criar entidade Account
    const account = Account.create(
      uuidv4(),
      emailVO.getValue(),
      passwordVO.getHash(),
    );

    // Salvar no repositório
    await this.accountRepository.save(account);

    return account;
  }
}
