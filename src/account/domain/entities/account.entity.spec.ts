import { Account } from './account.entity';

describe('Account Entity', () => {
  const mockId = 'test-id-123';
  const mockEmail = 'test@example.com';
  const mockPasswordHash = 'hashed_password';
  const mockCreatedAt = new Date('2023-01-01T00:00:00Z');

  it('should create a new account', () => {
    // Act
    const account = Account.create(mockId, mockEmail, mockPasswordHash, mockCreatedAt);
    
    // Assert
    expect(account).toBeDefined();
    expect(account.id).toBe(mockId);
    expect(account.email).toBe(mockEmail);
    expect(account.passwordHash).toBe(mockPasswordHash);
    expect(account.createdAt).toEqual(mockCreatedAt);
    expect(account.characters).toEqual([]);
    expect(account.isActive).toBe(true);
    expect(account.lastLogin).toBeUndefined();
  });

  it('should create an account from primitives', () => {
    // Arrange
    const mockData = {
      id: mockId,
      email: mockEmail,
      passwordHash: mockPasswordHash,
      createdAt: mockCreatedAt,
      characters: ['char-1', 'char-2'],
      isActive: false,
      lastLogin: new Date('2023-01-02T00:00:00Z')
    };
    
    // Act
    const account = Account.fromPrimitives(mockData);
    
    // Assert
    expect(account).toBeDefined();
    expect(account.id).toBe(mockData.id);
    expect(account.email).toBe(mockData.email);
    expect(account.passwordHash).toBe(mockData.passwordHash);
    expect(account.createdAt).toEqual(mockData.createdAt);
    expect(account.characters).toEqual(mockData.characters);
    expect(account.isActive).toBe(mockData.isActive);
    expect(account.lastLogin).toEqual(mockData.lastLogin);
  });

  it('should update email', () => {
    // Arrange
    const account = Account.create(mockId, mockEmail, mockPasswordHash);
    const newEmail = 'new@example.com';
    
    // Act
    account.updateEmail(newEmail);
    
    // Assert
    expect(account.email).toBe(newEmail);
  });

  it('should update password hash', () => {
    // Arrange
    const account = Account.create(mockId, mockEmail, mockPasswordHash);
    const newPasswordHash = 'new_hashed_password';
    
    // Act
    account.updatePasswordHash(newPasswordHash);
    
    // Assert
    expect(account.passwordHash).toBe(newPasswordHash);
  });

  it('should add a character', () => {
    // Arrange
    const account = Account.create(mockId, mockEmail, mockPasswordHash);
    const characterId = 'char-1';
    
    // Act
    account.addCharacter(characterId);
    
    // Assert
    expect(account.characters).toContain(characterId);
    expect(account.characters.length).toBe(1);
    
    // Should not add duplicate
    account.addCharacter(characterId);
    expect(account.characters.length).toBe(1);
  });

  it('should remove a character', () => {
    // Arrange
    const account = Account.fromPrimitives({
      id: mockId,
      email: mockEmail,
      passwordHash: mockPasswordHash,
      createdAt: mockCreatedAt,
      characters: ['char-1', 'char-2']
    });
    
    // Act
    account.removeCharacter('char-1');
    
    // Assert
    expect(account.characters).not.toContain('char-1');
    expect(account.characters).toContain('char-2');
    expect(account.characters.length).toBe(1);
  });

  it('should deactivate and activate account', () => {
    // Arrange
    const account = Account.create(mockId, mockEmail, mockPasswordHash);
    expect(account.isActive).toBe(true);
    
    // Act - deactivate
    account.deactivate();
    
    // Assert
    expect(account.isActive).toBe(false);
    
    // Act - activate
    account.activate();
    
    // Assert
    expect(account.isActive).toBe(true);
  });

  it('should update last login', () => {
    // Arrange
    const account = Account.create(mockId, mockEmail, mockPasswordHash);
    expect(account.lastLogin).toBeUndefined();
    
    // Mock Date.now
    const mockDate = new Date('2023-02-01T00:00:00Z');
    jest.spyOn(global, 'Date').mockImplementationOnce(() => mockDate as any);
    
    // Act
    account.updateLastLogin();
    
    // Assert
    expect(account.lastLogin).toEqual(mockDate);
  });

  it('should convert to primitives', () => {
    // Arrange
    const mockData = {
      id: mockId,
      email: mockEmail,
      passwordHash: mockPasswordHash,
      createdAt: mockCreatedAt,
      characters: ['char-1', 'char-2'],
      isActive: false,
      lastLogin: new Date('2023-01-02T00:00:00Z')
    };
    const account = Account.fromPrimitives(mockData);
    
    // Act
    const primitives = account.toPrimitives();
    
    // Assert
    expect(primitives).toEqual(mockData);
  });
});
