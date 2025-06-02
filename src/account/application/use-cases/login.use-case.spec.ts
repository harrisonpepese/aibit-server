import { Test } from '@nestjs/testing';
import { LoginUseCase } from './login.use-case';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { ACCOUNT_REPOSITORY_TOKEN } from '../../domain/repositories/account.repository.token';
import { Account } from '../../domain/entities/account.entity';
import { Password } from '../../domain/value-objects/password.vo';

// Mock Password
jest.mock('../../domain/value-objects/password.vo');
const MockPassword = Password as jest.MockedClass<typeof Password>;

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
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
        LoginUseCase,
        {
          provide: ACCOUNT_REPOSITORY_TOKEN,
          useValue: mockAccountRepository
        }
      ]
    }).compile();

    loginUseCase = moduleRef.get<LoginUseCase>(LoginUseCase);
    
    // Setup Password mock
    MockPassword.fromHash.mockReturnValue(new Password('', true));
    MockPassword.prototype.verify = jest.fn().mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'password123';
    
    // Mock account
    const mockAccount = {
      email,
      passwordHash: 'hashed_password',
      isActive: true,
      updateLastLogin: jest.fn()
    } as unknown as Account;
    
    // Mock repository
    mockAccountRepository.findByEmail.mockResolvedValue(mockAccount);
    
    // Act
    const result = await loginUseCase.execute(email, password);
    
    // Assert
    expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(MockPassword.fromHash).toHaveBeenCalledWith('hashed_password');
    expect(MockPassword.prototype.verify).toHaveBeenCalledWith(password);
    expect(mockAccount.updateLastLogin).toHaveBeenCalled();
    expect(mockAccountRepository.save).toHaveBeenCalledWith(mockAccount);
    expect(result).toBe(mockAccount);
  });

  it('should throw an error when account not found', async () => {
    // Arrange
    const email = 'nonexistent@example.com';
    const password = 'password123';
    
    // Mock repository
    mockAccountRepository.findByEmail.mockResolvedValue(null);
    
    // Act & Assert
    await expect(loginUseCase.execute(email, password))
      .rejects
      .toThrow('Credenciais inválidas');
    
    expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(MockPassword.fromHash).not.toHaveBeenCalled();
    expect(mockAccountRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error when account is inactive', async () => {
    // Arrange
    const email = 'inactive@example.com';
    const password = 'password123';
    
    // Mock account
    const mockAccount = {
      email,
      passwordHash: 'hashed_password',
      isActive: false
    } as unknown as Account;
    
    // Mock repository
    mockAccountRepository.findByEmail.mockResolvedValue(mockAccount);
    
    // Act & Assert
    await expect(loginUseCase.execute(email, password))
      .rejects
      .toThrow('Conta inativa');
    
    expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(MockPassword.fromHash).not.toHaveBeenCalled();
    expect(mockAccountRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error when password is invalid', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'wrong_password';
    
    // Mock account
    const mockAccount = {
      email,
      passwordHash: 'hashed_password',
      isActive: true
    } as unknown as Account;
    
    // Mock repository and password verification
    mockAccountRepository.findByEmail.mockResolvedValue(mockAccount);
    MockPassword.prototype.verify = jest.fn().mockResolvedValue(false);
    
    // Act & Assert
    await expect(loginUseCase.execute(email, password))
      .rejects
      .toThrow('Credenciais inválidas');
    
    expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(MockPassword.fromHash).toHaveBeenCalledWith('hashed_password');
    expect(MockPassword.prototype.verify).toHaveBeenCalledWith(password);
    expect(mockAccountRepository.save).not.toHaveBeenCalled();
  });
});
