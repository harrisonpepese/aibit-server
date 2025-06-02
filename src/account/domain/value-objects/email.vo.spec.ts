import { Email } from './email.vo';

describe('Email Value Object', () => {
  it('should create a valid Email value object', () => {
    // Arrange & Act
    const email = new Email('test@example.com');
    
    // Assert
    expect(email).toBeDefined();
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should throw an error when email is empty', () => {
    // Arrange & Act & Assert
    expect(() => new Email('')).toThrow('Email é obrigatório');
  });

  it('should throw an error when email format is invalid', () => {
    // Arrange & Act & Assert
    expect(() => new Email('invalid-email')).toThrow('Formato de email inválido');
    expect(() => new Email('test@')).toThrow('Formato de email inválido');
    expect(() => new Email('@example.com')).toThrow('Formato de email inválido');
    expect(() => new Email('test@example')).toThrow('Formato de email inválido');
  });

  it('should throw an error when email is too long', () => {
    // Arrange
    const longPrefix = 'a'.repeat(247);
    const longEmail = `${longPrefix}@example.com`;
    
    // Act & Assert
    expect(() => new Email(longEmail)).toThrow('Email muito longo');
  });

  it('should compare two emails correctly', () => {
    // Arrange
    const email1 = new Email('test@example.com');
    const email2 = new Email('test@example.com');
    const email3 = new Email('other@example.com');
    
    // Act & Assert
    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });

  it('should convert to string correctly', () => {
    // Arrange
    const emailStr = 'test@example.com';
    const email = new Email(emailStr);
    
    // Act & Assert
    expect(email.toString()).toBe(emailStr);
  });
});
