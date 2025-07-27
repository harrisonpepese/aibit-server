import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CreateAccountUseCase } from './application/use-cases/create-account.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { GetAccountUseCase } from './application/use-cases/get-account.use-case';
import { AuthService } from './application/use-cases/auth.service';
import { ACCOUNT_REPOSITORY_TOKEN } from './domain/repositories/account.repository.token';
import { InMemoryAccountRepository } from './infrastructure/repositories/in-memory-account.repository';

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    CreateAccountUseCase,
    LoginUseCase,
    GetAccountUseCase,
    AuthService,
    {
      provide: ACCOUNT_REPOSITORY_TOKEN,
      useClass: InMemoryAccountRepository,
    },
  ],
  exports: [AccountService, AuthService],
})
export class AccountModule {}