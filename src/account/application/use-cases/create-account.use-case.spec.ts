import { Test } from '@nestjs/testing';
import { CreateAccountUseCase } from './create-account.use-case';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { ACCOUNT_REPOSITORY_TOKEN } from '../../domain/repositories/account.repository.token';
import { Account } from '../../domain/entities/account.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid')
}));

// Mock Email
jest.mock('../../domain/value-objects/email.vo');
const MockEmail = Email as jest.MockedClass<typeof Email>;

// Mock Password
jest.mock('../../domain/value-objects/password.vo');
const MockPassword = Password as jest.MockedClass<typeof Password>;

describe('CreateAccountUseCase', () => {
  let createAccountUseCase: CreateAccountUseCase;
  let mockAccountRepository: jest.Mocked<AccountRepository>;
  
  beforeEach(async () => {
    // Mock implementation for Email and Password
    MockEmail.prototype.getValue.mockReturnValue('test@example.com');
    MockPassword.prototype.getHash.mockReturnValue('hashed_password');
    
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
        CreateAccountUseCase,
        {
          provide: ACCOUNT_REPOSITORY_TOKEN,
          useValue: mockAccountRepository
        }
      ]
    }).compile();

    createAccountUseCase = moduleRef.get<CreateAccountUseCase>(CreateAccountUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new account successfully', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'password123';
    
    // Mock account
    const mockAccount = {} as Account;
    
    // Mock methods
    mockAccountRepository.exists.mockResolvedValue(false);
    jest.spyOn(Account, 'create').mockReturnValue(mockAccount);
    
    // Act
    const result = await createAccountUseCase.execute(email, password);
    
    // Assert
    expect(MockEmail).toHaveBeenCalledWith(email);
    expect(MockPassword).toHaveBeenCalledWith(password);
    expect(Account.create).toHaveBeenCalledWith(
      'mocked-uuid', 
      'test@example.com', 
      'hashed_password'
    );
    expect(mockAccountRepository.save).toHaveBeenCalledWith(mockAccount);
    expect(result).toBe(mockAccount);
  });

  it('should throw an error if email already exists', async () => {
    // Arrange
    const email = 'existing@example.com';
    const password = 'password123';
    
    // Mock methods
    mockAccountRepository.exists.mockResolvedValue(true);
    
    // Act & Assert
    await expect(createAccountUseCase.execute(email, password))
      .rejects
      .toThrow('Email já está em uso');
    
    // Additional assertions
    expect(mockAccountRepository.exists).toHaveBeenCalledWith(email);
    expect(Account.create).not.toHaveBeenCalled();
    expect(mockAccountRepository.save).not.toHaveBeenCalled();
  });
});
