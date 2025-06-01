import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';
import { AccountResponseDto } from './dto/account-response.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  async register(@Body() createAccountDto: CreateAccountDto): Promise<AccountResponseDto> {
    try {
      return await this.accountService.createAccount(createAccountDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar conta';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AccountResponseDto> {
    try {
      return await this.accountService.login(loginDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login';
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get(':id')
  async getAccount(@Param('id') id: string): Promise<AccountResponseDto> {
    try {
      return await this.accountService.getAccount(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Conta não encontrada';
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }
  }
}