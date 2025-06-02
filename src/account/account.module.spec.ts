import { Test } from '@nestjs/testing';
import { AccountModule } from './account.module';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { CreateAccountUseCase } from './application/use-cases/create-account.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { GetAccountUseCase } from './application/use-cases/get-account.use-case';
import { ACCOUNT_REPOSITORY_TOKEN } from './domain/repositories/account.repository.token';
import { InMemoryAccountRepository } from './infrastructure/repositories/in-memory-account.repository';

describe('AccountModule', () => {
  let accountModule: AccountModule;
  let accountService: AccountService;
  let accountController: AccountController;
  let createAccountUseCase: CreateAccountUseCase;
  let loginUseCase: LoginUseCase;
  let getAccountUseCase: GetAccountUseCase;
  let accountRepository: InMemoryAccountRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AccountModule],
    }).compile();

    accountModule = moduleRef.get<AccountModule>(AccountModule);
    accountService = moduleRef.get<AccountService>(AccountService);
    accountController = moduleRef.get<AccountController>(AccountController);
    createAccountUseCase = moduleRef.get<CreateAccountUseCase>(CreateAccountUseCase);
    loginUseCase = moduleRef.get<LoginUseCase>(LoginUseCase);
    getAccountUseCase = moduleRef.get<GetAccountUseCase>(GetAccountUseCase);
    accountRepository = moduleRef.get<InMemoryAccountRepository>(ACCOUNT_REPOSITORY_TOKEN);
  });

  it('should compile the module', () => {
    expect(accountModule).toBeDefined();
  });

  it('should provide AccountService', () => {
    expect(accountService).toBeDefined();
    expect(accountService).toBeInstanceOf(AccountService);
  });

  it('should provide AccountController', () => {
    expect(accountController).toBeDefined();
    expect(accountController).toBeInstanceOf(AccountController);
  });

  it('should provide CreateAccountUseCase', () => {
    expect(createAccountUseCase).toBeDefined();
    expect(createAccountUseCase).toBeInstanceOf(CreateAccountUseCase);
  });

  it('should provide LoginUseCase', () => {
    expect(loginUseCase).toBeDefined();
    expect(loginUseCase).toBeInstanceOf(LoginUseCase);
  });

  it('should provide GetAccountUseCase', () => {
    expect(getAccountUseCase).toBeDefined();
    expect(getAccountUseCase).toBeInstanceOf(GetAccountUseCase);
  });

  it('should provide AccountRepository', () => {
    expect(accountRepository).toBeDefined();
    expect(accountRepository).toBeInstanceOf(InMemoryAccountRepository);
  });
});
