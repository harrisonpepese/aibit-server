import { InMemoryChannelRepository } from './in-memory-channel.repository';
import { Channel } from '../../domain/entities/channel.entity';

describe('InMemoryChannelRepository', () => {
  let repository: InMemoryChannelRepository;
  let testChannel: Channel;
  
  const channelName = 'Test Channel';
  const channelDescription = 'This is a test channel';
  const ownerId = 'owner-123';
  
  beforeEach(() => {
    repository = new InMemoryChannelRepository();
    testChannel = Channel.create(
      channelName,
      channelDescription,
      ownerId,
      true
    );
  });
  
  it('should save a channel', async () => {
    // Act
    await repository.save(testChannel);
    
    // Assert - Verify it can be retrieved
    const result = await repository.findById(testChannel.getId());
    expect(result).toBe(testChannel);
  });
  
  it('should find channel by id', async () => {
    // Arrange
    await repository.save(testChannel);
    
    // Act
    const result = await repository.findById(testChannel.getId());
    
    // Assert
    expect(result).toBe(testChannel);
  });
  
  it('should return null when channel not found by id', async () => {
    // Act
    const result = await repository.findById('nonexistent-id');
    
    // Assert
    expect(result).toBeNull();
  });
  
  it('should find channel by name', async () => {
    // Arrange
    await repository.save(testChannel);
    
    // Act
    const result = await repository.findByName(channelName);
    
    // Assert
    expect(result).toBe(testChannel);
  });
  
  it('should find channel by name case-insensitive', async () => {
    // Arrange
    await repository.save(testChannel);
    
    // Act
    const result = await repository.findByName(channelName.toLowerCase());
    
    // Assert
    expect(result).toBe(testChannel);
  });
  
  it('should return null when channel not found by name', async () => {
    // Act
    const result = await repository.findByName('nonexistent-channel');
    
    // Assert
    expect(result).toBeNull();
  });
  
  it('should find public channels', async () => {
    // Arrange
    const publicChannel = Channel.create('Public Channel', 'Public', ownerId, true);
    const privateChannel = Channel.create('Private Channel', 'Private', ownerId, false);
    
    await repository.save(publicChannel);
    await repository.save(privateChannel);
    
    // Act
    const result = await repository.findPublicChannels();
    
    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(publicChannel);
  });
  
  it('should find channels by member', async () => {
    // Arrange
    const memberId = 'member-456';
    const channelWithMember = Channel.create('Channel with Member', 'Has Member', ownerId, true);
    channelWithMember.addMember(memberId);
    
    const channelWithoutMember = Channel.create('Channel without Member', 'No Member', ownerId, true);
    
    await repository.save(channelWithMember);
    await repository.save(channelWithoutMember);
    
    // Act
    const result = await repository.findChannelsByMember(memberId);
    
    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(channelWithMember);
  });
  
  it('should find channels by owner', async () => {
    // Arrange
    const otherOwnerId = 'owner-789';
    const channelWithOwner = Channel.create('Owner Channel', 'Owned', ownerId, true);
    const channelWithOtherOwner = Channel.create('Other Owner Channel', 'Other Owned', otherOwnerId, true);
    
    await repository.save(channelWithOwner);
    await repository.save(channelWithOtherOwner);
    
    // Act
    const result = await repository.findChannelsByOwner(ownerId);
    
    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(channelWithOwner);
  });
  
  it('should delete a channel', async () => {
    // Arrange
    await repository.save(testChannel);
    
    // Act
    await repository.delete(testChannel.getId());
    
    // Assert
    const result = await repository.findById(testChannel.getId());
    expect(result).toBeNull();
  });
  
  it('should check if channel exists by name', async () => {
    // Arrange
    await repository.save(testChannel);
    
    // Act - Existing channel
    const existsResult = await repository.exists(channelName);
    
    // Act - Non-existing channel
    const notExistsResult = await repository.exists('nonexistent-channel');
    
    // Assert
    expect(existsResult).toBe(true);
    expect(notExistsResult).toBe(false);
  });
});
