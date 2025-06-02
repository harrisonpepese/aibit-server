import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';
import { AccountResponseDto } from './dto/account-response.dto';

describe('AccountController', () => {
  let accountController: AccountController;
  let mockAccountService: jest.Mocked<AccountService>;

  // Mock response data
  const mockAccountResponse = {
    id: 'test-id',
    email: 'test@example.com',
    characters: [],
    isActive: true,
    createdAt: new Date('2023-01-01'),
    lastLogin: undefined
  };

  beforeEach(async () => {
    // Create mock for AccountService
    mockAccountService = {
      createAccount: jest.fn(),
      login: jest.fn(),
      getAccount: jest.fn()
    } as unknown as jest.Mocked<AccountService>;

    const moduleRef = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        { provide: AccountService, useValue: mockAccountService }
      ]
    }).compile();

    accountController = moduleRef.get<AccountController>(AccountController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new account', async () => {
      // Arrange
      const createAccountDto: CreateAccountDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockAccountService.createAccount.mockResolvedValue(
        mockAccountResponse as AccountResponseDto
      );

      // Act
      const result = await accountController.register(createAccountDto);

      // Assert
      expect(mockAccountService.createAccount).toHaveBeenCalledWith(createAccountDto);
      expect(result).toEqual(mockAccountResponse);
    });

    it('should handle errors during registration', async () => {
      // Arrange
      const createAccountDto: CreateAccountDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      const errorMessage = 'Email já está em uso';
      mockAccountService.createAccount.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(accountController.register(createAccountDto))
        .rejects
        .toThrow(new HttpException(errorMessage, HttpStatus.BAD_REQUEST));
      
      expect(mockAccountService.createAccount).toHaveBeenCalledWith(createAccountDto);
    });

    it('should handle generic errors during registration', async () => {
      // Arrange
      const createAccountDto: CreateAccountDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockAccountService.createAccount.mockRejectedValue('Generic error');

      // Act & Assert
      await expect(accountController.register(createAccountDto))
        .rejects
        .toThrow(new HttpException('Erro ao criar conta', HttpStatus.BAD_REQUEST));
      
      expect(mockAccountService.createAccount).toHaveBeenCalledWith(createAccountDto);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockAccountService.login.mockResolvedValue(
        mockAccountResponse as AccountResponseDto
      );

      // Act
      const result = await accountController.login(loginDto);

      // Assert
      expect(mockAccountService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockAccountResponse);
    });

    it('should handle errors during login', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      const errorMessage = 'Credenciais inválidas';
      mockAccountService.login.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(accountController.login(loginDto))
        .rejects
        .toThrow(new HttpException(errorMessage, HttpStatus.UNAUTHORIZED));
      
      expect(mockAccountService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('getAccount', () => {
    it('should get account by id', async () => {
      // Arrange
      const accountId = 'test-id';

      mockAccountService.getAccount.mockResolvedValue(
        mockAccountResponse as AccountResponseDto
      );

      // Act
      const result = await accountController.getAccount(accountId);

      // Assert
      expect(mockAccountService.getAccount).toHaveBeenCalledWith(accountId);
      expect(result).toEqual(mockAccountResponse);
    });

    it('should handle errors when getting account', async () => {
      // Arrange
      const accountId = 'nonexistent-id';

      const errorMessage = 'Conta não encontrada';
      mockAccountService.getAccount.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(accountController.getAccount(accountId))
        .rejects
        .toThrow(new HttpException(errorMessage, HttpStatus.NOT_FOUND));
      
      expect(mockAccountService.getAccount).toHaveBeenCalledWith(accountId);
    });
  });
});
