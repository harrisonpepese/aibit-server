import { Test } from '@nestjs/testing';
import { LoginUseCase } from './login.use-case';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { ACCOUNT_REPOSITORY_TOKEN } from '../../domain/repositories/account.repository.token';
import { Account } from '../../domain/entities/account.entity';
import { Password } from '../../domain/value-objects/password.vo';

// Mock the Password class
jest.mock('../../domain/value-objects/password.vo');

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockAccountRepository: jest.Mocked<AccountRepository>;
  let mockPassword: jest.Mocked<Password>;
  
  beforeEach(async () => {
    // Create mock for AccountRepository
    mockAccountRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    };

    // Create mock password instance
    mockPassword = {
      verify: jest.fn(),
      getHash: jest.fn(),
    } as any;

    // Mock Password static method
    (Password.fromHash as jest.Mock) = jest.fn().mockReturnValue(mockPassword);

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'password123';
    
    const mockAccount = {
      email,
      passwordHash: 'hashed_password',
      isActive: true,
      updateLastLogin: jest.fn()
    } as unknown as Account;
    
    mockAccountRepository.findByEmail.mockResolvedValue(mockAccount);
    mockPassword.verify.mockResolvedValue(true);
    
    // Act
    const result = await loginUseCase.execute(email, password);
    
    // Assert
    expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(Password.fromHash).toHaveBeenCalledWith('hashed_password');
    expect(mockPassword.verify).toHaveBeenCalledWith(password);
    expect(mockAccount.updateLastLogin).toHaveBeenCalled();
    expect(mockAccountRepository.save).toHaveBeenCalledWith(mockAccount);
    expect(result).toBe(mockAccount);
  });

  it('should throw an error when account not found', async () => {
    // Arrange
    const email = 'nonexistent@example.com';
    const password = 'password123';
    
    mockAccountRepository.findByEmail.mockResolvedValue(null);
    
    // Act & Assert
    await expect(loginUseCase.execute(email, password))
      .rejects
      .toThrow('Credenciais inválidas');
    
    expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(Password.fromHash).not.toHaveBeenCalled();
    expect(mockAccountRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error when account is inactive', async () => {
    // Arrange
    const email = 'inactive@example.com';
    const password = 'password123';
    
    const mockAccount = {
      email,
      passwordHash: 'hashed_password',
      isActive: false
    } as unknown as Account;
    
    mockAccountRepository.findByEmail.mockResolvedValue(mockAccount);
    
    // Act & Assert
    await expect(loginUseCase.execute(email, password))
      .rejects
      .toThrow('Conta inativa');
    
    expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(Password.fromHash).not.toHaveBeenCalled();
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
    
    // Mock repository e password verification
    mockAccountRepository.findByEmail.mockResolvedValue(mockAccount);
    mockPassword.verify.mockResolvedValue(false);
    (Password.fromHash as jest.Mock).mockReturnValue(mockPassword);
    
    // Act & Assert
    await expect(loginUseCase.execute(email, password))
      .rejects
      .toThrow('Credenciais inválidas');
    
    expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(Password.fromHash).toHaveBeenCalledWith('hashed_password');
    expect(mockPassword.verify).toHaveBeenCalledWith(password);
    expect(mockAccountRepository.save).not.toHaveBeenCalled();
  });
});
