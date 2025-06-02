import { Test } from '@nestjs/testing';
import { GetAccountUseCase } from './get-account.use-case';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { ACCOUNT_REPOSITORY_TOKEN } from '../../domain/repositories/account.repository.token';
import { Account } from '../../domain/entities/account.entity';

describe('GetAccountUseCase', () => {
  let getAccountUseCase: GetAccountUseCase;
  let mockAccountRepository: jest.Mocked<AccountRepository>;
  
  beforeEach(async () => {
    // Create mock for AccountRepository
    mockAccountRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetAccountUseCase,
        {
          provide: ACCOUNT_REPOSITORY_TOKEN,
          useValue: mockAccountRepository
        }
      ]
    }).compile();

    getAccountUseCase = moduleRef.get<GetAccountUseCase>(GetAccountUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get account by id successfully', async () => {
    // Arrange
    const accountId = 'test-account-id';
    
    // Mock account
    const mockAccount = { id: accountId } as Account;
    
    // Mock repository
    mockAccountRepository.findById.mockResolvedValue(mockAccount);
    
    // Act
    const result = await getAccountUseCase.execute(accountId);
    
    // Assert
    expect(mockAccountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(result).toBe(mockAccount);
  });

  it('should throw an error when account is not found', async () => {
    // Arrange
    const accountId = 'nonexistent-id';
    
    // Mock repository
    mockAccountRepository.findById.mockResolvedValue(null);
    
    // Act & Assert
    await expect(getAccountUseCase.execute(accountId))
      .rejects
      .toThrow('Conta não encontrada');
    
    expect(mockAccountRepository.findById).toHaveBeenCalledWith(accountId);
  });
});
