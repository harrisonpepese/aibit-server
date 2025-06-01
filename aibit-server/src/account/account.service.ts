import { Injectable } from '@nestjs/common';
import { CreateAccountUseCase } from './application/use-cases/create-account.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { GetAccountUseCase } from './application/use-cases/get-account.use-case';
import { AccountResponseDto } from './dto/account-response.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getAccountUseCase: GetAccountUseCase,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<AccountResponseDto> {
    const account = await this.createAccountUseCase.execute(
      createAccountDto.email,
      createAccountDto.password,
    );

    const accountData = account.toPrimitives();
    return new AccountResponseDto({
      id: accountData.id,
      email: accountData.email,
      characters: accountData.characters,
      isActive: accountData.isActive,
      createdAt: accountData.createdAt,
      lastLogin: accountData.lastLogin,
    });
  }

  async login(loginDto: LoginDto): Promise<AccountResponseDto> {
    const account = await this.loginUseCase.execute(
      loginDto.email,
      loginDto.password,
    );

    const accountData = account.toPrimitives();
    return new AccountResponseDto({
      id: accountData.id,
      email: accountData.email,
      characters: accountData.characters,
      isActive: accountData.isActive,
      createdAt: accountData.createdAt,
      lastLogin: accountData.lastLogin,
    });
  }

  async getAccount(accountId: string): Promise<AccountResponseDto> {
    const account = await this.getAccountUseCase.execute(accountId);

    const accountData = account.toPrimitives();
    return new AccountResponseDto({
      id: accountData.id,
      email: accountData.email,
      characters: accountData.characters,
      isActive: accountData.isActive,
      createdAt: accountData.createdAt,
      lastLogin: accountData.lastLogin,
    });
  }
}