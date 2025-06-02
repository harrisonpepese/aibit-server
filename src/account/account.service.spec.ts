import { Test } from '@nestjs/testing';
import { AccountService } from './account.service';
import { CreateAccountUseCase } from './application/use-cases/create-account.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { GetAccountUseCase } from './application/use-cases/get-account.use-case';
import { Account } from './domain/entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';
import { AccountResponseDto } from './dto/account-response.dto';

describe('AccountService', () => {
  let accountService: AccountService;
  let mockCreateAccountUseCase: jest.Mocked<CreateAccountUseCase>;
  let mockLoginUseCase: jest.Mocked<LoginUseCase>;
  let mockGetAccountUseCase: jest.Mocked<GetAccountUseCase>;

  // Mock account data
  const mockAccountData = {
    id: 'test-id',
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    createdAt: new Date('2023-01-01'),
    characters: ['char-1'],
    isActive: true,
    lastLogin: new Date('2023-01-02')
  };

  beforeEach(async () => {
    // Create mocks for use cases
    mockCreateAccountUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<CreateAccountUseCase>;

    mockLoginUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<LoginUseCase>;

    mockGetAccountUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<GetAccountUseCase>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: CreateAccountUseCase, useValue: mockCreateAccountUseCase },
        { provide: LoginUseCase, useValue: mockLoginUseCase },
        { provide: GetAccountUseCase, useValue: mockGetAccountUseCase }
      ]
    }).compile();

    accountService = moduleRef.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create an account and return AccountResponseDto', async () => {
      // Arrange
      const createAccountDto: CreateAccountDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock account entity
      const mockAccount = {
        toPrimitives: jest.fn().mockReturnValue(mockAccountData)
      } as unknown as Account;

      mockCreateAccountUseCase.execute.mockResolvedValue(mockAccount);

      // Act
      const result = await accountService.createAccount(createAccountDto);

      // Assert
      expect(mockCreateAccountUseCase.execute).toHaveBeenCalledWith(
        createAccountDto.email,
        createAccountDto.password
      );
      expect(mockAccount.toPrimitives).toHaveBeenCalled();
      
      expect(result).toBeInstanceOf(AccountResponseDto);
      expect(result).toEqual(
        expect.objectContaining({
          id: mockAccountData.id,
          email: mockAccountData.email,
          characters: mockAccountData.characters,
          isActive: mockAccountData.isActive,
          createdAt: mockAccountData.createdAt,
          lastLogin: mockAccountData.lastLogin
        })
      );
    });
  });

  describe('login', () => {
    it('should login and return AccountResponseDto', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock account entity
      const mockAccount = {
        toPrimitives: jest.fn().mockReturnValue(mockAccountData)
      } as unknown as Account;

      mockLoginUseCase.execute.mockResolvedValue(mockAccount);

      // Act
      const result = await accountService.login(loginDto);

      // Assert
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password
      );
      expect(mockAccount.toPrimitives).toHaveBeenCalled();
      
      expect(result).toBeInstanceOf(AccountResponseDto);
      expect(result).toEqual(
        expect.objectContaining({
          id: mockAccountData.id,
          email: mockAccountData.email,
          characters: mockAccountData.characters,
          isActive: mockAccountData.isActive,
          createdAt: mockAccountData.createdAt,
          lastLogin: mockAccountData.lastLogin
        })
      );
    });
  });

  describe('getAccount', () => {
    it('should get account by id and return AccountResponseDto', async () => {
      // Arrange
      const accountId = 'test-id';

      // Mock account entity
      const mockAccount = {
        toPrimitives: jest.fn().mockReturnValue(mockAccountData)
      } as unknown as Account;

      mockGetAccountUseCase.execute.mockResolvedValue(mockAccount);

      // Act
      const result = await accountService.getAccount(accountId);

      // Assert
      expect(mockGetAccountUseCase.execute).toHaveBeenCalledWith(accountId);
      expect(mockAccount.toPrimitives).toHaveBeenCalled();
      
      expect(result).toBeInstanceOf(AccountResponseDto);
      expect(result).toEqual(
        expect.objectContaining({
          id: mockAccountData.id,
          email: mockAccountData.email,
          characters: mockAccountData.characters,
          isActive: mockAccountData.isActive,
          createdAt: mockAccountData.createdAt,
          lastLogin: mockAccountData.lastLogin
        })
      );
    });
  });
});
