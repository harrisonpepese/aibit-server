import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CreateAccountUseCase } from './application/use-cases/create-account.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { GetAccountUseCase } from './application/use-cases/get-account.use-case';
import { ACCOUNT_REPOSITORY_TOKEN } from './domain/repositories/account.repository.token';
import { InMemoryAccountRepository } from './infrastructure/repositories/in-memory-account.repository';

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    CreateAccountUseCase,
    LoginUseCase,
    GetAccountUseCase,
    {
      provide: ACCOUNT_REPOSITORY_TOKEN,
      useClass: InMemoryAccountRepository,
    },
  ],
  exports: [AccountService],
})
export class AccountModule {}