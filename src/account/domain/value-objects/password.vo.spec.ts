import { Password } from './password.vo';
import * as bcrypt from 'bcrypt';

// Mock bcrypt para evitar hashing real nos testes
jest.mock('bcrypt', () => ({
  hashSync: jest.fn().mockReturnValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true)
}));

describe('Password Value Object', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a Password value object with hashing', () => {
    // Arrange & Act
    const password = new Password('password123');
    
    // Assert
    expect(password).toBeDefined();
    expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 10);
    expect(password.getHash()).toBe('hashed_password');
  });

  it('should create a Password value object from existing hash', () => {
    // Arrange & Act
    const password = Password.fromHash('existing_hash');
    
    // Assert
    expect(password).toBeDefined();
    expect(bcrypt.hashSync).not.toHaveBeenCalled();
    expect(password.getHash()).toBe('existing_hash');
  });

  it('should throw an error when password is empty', () => {
    // Act & Assert
    expect(() => new Password('')).toThrow('Senha é obrigatória');
  });

  it('should throw an error when password is too short', () => {
    // Act & Assert
    expect(() => new Password('12345')).toThrow('Senha deve ter pelo menos 6 caracteres');
  });

  it('should throw an error when password is too long', () => {
    // Arrange
    const longPassword = 'a'.repeat(101);
    
    // Act & Assert
    expect(() => new Password(longPassword)).toThrow('Senha muito longa');
  });

  it('should verify password correctly', async () => {
    // Arrange
    const password = new Password('password123');
    
    // Act
    const isValid = await password.verify('password123');
    
    // Assert
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
    expect(isValid).toBe(true);
  });

  it('should handle invalid password during verification', async () => {
    // Arrange
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
    const password = new Password('password123');
    
    // Act
    const isValid = await password.verify('wrong_password');
    
    // Assert
    expect(bcrypt.compare).toHaveBeenCalledWith('wrong_password', 'hashed_password');
    expect(isValid).toBe(false);
  });
});
