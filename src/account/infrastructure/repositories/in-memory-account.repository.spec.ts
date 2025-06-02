import { InMemoryAccountRepository } from './in-memory-account.repository';
import { Account } from '../../domain/entities/account.entity';

describe('InMemoryAccountRepository', () => {
  let repository: InMemoryAccountRepository;
  let testAccount: Account;
  
  const accountId = 'test-id-123';
  const email = 'test@example.com';
  
  beforeEach(() => {
    repository = new InMemoryAccountRepository();
    testAccount = Account.create(
      accountId,
      email,
      'hashed_password',
      new Date('2023-01-01')
    );
  });
  
  it('should save an account', async () => {
    // Act
    await repository.save(testAccount);
    
    // Assert - Verify it can be retrieved
    const result = await repository.findById(accountId);
    expect(result).toBe(testAccount);
  });
  
  it('should find account by id', async () => {
    // Arrange
    await repository.save(testAccount);
    
    // Act
    const result = await repository.findById(accountId);
    
    // Assert
    expect(result).toBe(testAccount);
  });
  
  it('should return null when account not found by id', async () => {
    // Act
    const result = await repository.findById('nonexistent-id');
    
    // Assert
    expect(result).toBeNull();
  });
  
  it('should find account by email', async () => {
    // Arrange
    await repository.save(testAccount);
    
    // Act
    const result = await repository.findByEmail(email);
    
    // Assert
    expect(result).toBe(testAccount);
  });
  
  it('should return null when account not found by email', async () => {
    // Act
    const result = await repository.findByEmail('nonexistent@example.com');
    
    // Assert
    expect(result).toBeNull();
  });
  
  it('should delete an account', async () => {
    // Arrange
    await repository.save(testAccount);
    
    // Act
    await repository.delete(accountId);
    
    // Assert
    const result = await repository.findById(accountId);
    expect(result).toBeNull();
  });
  
  it('should check if email exists', async () => {
    // Arrange
    await repository.save(testAccount);
    
    // Act & Assert
    const existingResult = await repository.exists(email);
    expect(existingResult).toBe(true);
    
    const nonExistingResult = await repository.exists('nonexistent@example.com');
    expect(nonExistingResult).toBe(false);
  });
  
  it('should update an existing account', async () => {
    // Arrange
    await repository.save(testAccount);
    
    // Modify the account
    testAccount.updateEmail('updated@example.com');
    
    // Act
    await repository.save(testAccount);
    
    // Assert
    const result = await repository.findById(accountId);
    expect(result).toBe(testAccount);
    expect(result?.email).toBe('updated@example.com');
    
    // Email lookup should work with new email
    const byEmail = await repository.findByEmail('updated@example.com');
    expect(byEmail).toBe(testAccount);
    
    // Old email should not exist anymore
    const byOldEmail = await repository.findByEmail(email);
    expect(byOldEmail).toBeNull();
  });
});
