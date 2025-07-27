import { Channel } from './channel.entity';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid')
}));

describe('Channel Entity', () => {
  it('should create a valid public channel', () => {
    // Arrange
    const name = 'General Chat';
    const description = 'Channel for general discussions';
    const ownerId = 'user-123';
    const isPublic = true;
    
    // Act
    const channel = Channel.create(name, description, ownerId, isPublic);
    
    // Assert    expect(channel.getId()).toBe('mocked-uuid');
    expect(channel.getName()).toBe(name);
    expect(channel.getDescription()).toBe(description);
    expect(channel.getOwnerId()).toBe(ownerId);
    expect(channel.getIsPublic()).toBe(isPublic);
    expect(channel.getCreatedAt()).toBeInstanceOf(Date);
    expect(channel.getModeratorIds()).toContain(ownerId);
    expect(channel.getMemberIds()).toContain(ownerId);
  });

  it('should create a valid private channel', () => {
    // Arrange
    const name = 'Private Group';
    const description = 'Private channel for team discussion';
    const ownerId = 'user-123';
    const isPublic = false;
    
    // Act
    const channel = Channel.create(name, description, ownerId, isPublic);
    
    // Assert
    expect(channel.getId()).toBe('mocked-uuid');
    expect(channel.getName()).toBe(name);
    expect(channel.getDescription()).toBe(description);
    expect(channel.getOwnerId()).toBe(ownerId);
    expect(channel.getIsPublic()).toBe(isPublic);
    expect(channel.getModeratorIds()).toContain(ownerId);
    expect(channel.getMemberIds()).toContain(ownerId);
  });

  it('should add a member', () => {
    // Arrange
    const channel = Channel.create('Test Channel', 'Test Description', 'owner-id', true);
    const memberId = 'user-456';
    
    // Act
    channel.addMember(memberId);
    
    // Assert
    expect(channel.isMember(memberId)).toBe(true);
    expect(channel.getMemberIds()).toContain(memberId);
  });

  it('should not add the same member twice', () => {
    // Arrange
    const channel = Channel.create('Test Channel', 'Test Description', 'owner-id', true);
    const memberId = 'user-456';
    
    // Act
    channel.addMember(memberId);
    channel.addMember(memberId);
    
    // Assert
    const members = channel.getMemberIds();
    expect(members.filter(id => id === memberId).length).toBe(1);
  });

  it('should remove a member', () => {
    // Arrange
    const channel = Channel.create('Test Channel', 'Test Description', 'owner-id', true);
    const memberId = 'user-456';
    channel.addMember(memberId);
    
    // Act
    channel.removeMember(memberId);
    
    // Assert
    expect(channel.isMember(memberId)).toBe(false);
    expect(channel.getMemberIds()).not.toContain(memberId);
  });
  it('should not remove the owner from members', () => {
    // Arrange
    const ownerId = 'owner-id';
    const channel = Channel.create('Test Channel', 'Test Description', ownerId, true);
    
    // Act & Assert
    expect(() => {
      channel.removeMember(ownerId);
    }).toThrow('Não é possível remover o dono do canal');
    
    // Verify owner is still a member
    expect(channel.isMember(ownerId)).toBe(true);
    expect(channel.getMemberIds()).toContain(ownerId);
  });

  it('should add a moderator', () => {
    // Arrange
    const channel = Channel.create('Test Channel', 'Test Description', 'owner-id', true);
    const memberId = 'user-456';
    channel.addMember(memberId);
    
    // Act
    channel.addModerator(memberId);
    
    // Assert
    expect(channel.isModerator(memberId)).toBe(true);
    expect(channel.getModeratorIds()).toContain(memberId);
  });

  it('should throw error when adding a moderator who is not a member', () => {
    // Arrange
    const channel = Channel.create('Test Channel', 'Test Description', 'owner-id', true);
    const nonMemberId = 'user-789';
    
    // Act & Assert
    expect(() => {
      channel.addModerator(nonMemberId);
    }).toThrow('O usuário deve ser membro do canal para se tornar moderador');
  });

  it('should remove a moderator', () => {
    // Arrange
    const channel = Channel.create('Test Channel', 'Test Description', 'owner-id', true);
    const memberId = 'user-456';
    channel.addMember(memberId);
    channel.addModerator(memberId);
    
    // Act
    channel.removeModerator(memberId);
    
    // Assert
    expect(channel.isModerator(memberId)).toBe(false);
    expect(channel.getModeratorIds()).not.toContain(memberId);
    // Should still be a member
    expect(channel.isMember(memberId)).toBe(true);
  });
  it('should not remove the owner from moderators', () => {
    // Arrange
    const ownerId = 'owner-id';
    const channel = Channel.create('Test Channel', 'Test Description', ownerId, true);
    
    // Act & Assert
    expect(() => {
      channel.removeModerator(ownerId);
    }).toThrow('Não é possível remover o dono como moderador');
    
    // Verify owner is still a moderator
    expect(channel.isModerator(ownerId)).toBe(true);
    expect(channel.getModeratorIds()).toContain(ownerId);
  });

  it('should update name and description', () => {
    // Arrange
    const channel = Channel.create('Old Name', 'Old Description', 'owner-id', true);
    const newName = 'New Name';
    const newDescription = 'New Description';
    
    // Act
    channel.updateName(newName);
    channel.updateDescription(newDescription);
    
    // Assert
    expect(channel.getName()).toBe(newName);
    expect(channel.getDescription()).toBe(newDescription);
  });

  it('should throw error for invalid name', () => {
    // Arrange
    const channel = Channel.create('Valid Name', 'Description', 'owner-id', true);
    const emptyName = '';
    const longName = 'A'.repeat(51); // 51 characters
    
    // Act & Assert - Empty name
    expect(() => {
      channel.updateName(emptyName);
    }).toThrow('Nome do canal não pode ser vazio');
    
    // Act & Assert - Long name
    expect(() => {
      channel.updateName(longName);
    }).toThrow('Nome do canal muito longo');
  });

  it('should throw error for too long description', () => {
    // Arrange
    const channel = Channel.create('Valid Name', 'Description', 'owner-id', true);
    const longDescription = 'A'.repeat(501); // 501 characters
    
    // Act & Assert
    expect(() => {
      channel.updateDescription(longDescription);
    }).toThrow('Descrição do canal muito longa');
  });

  it('should create channel from primitives', () => {
    // Arrange
    const channelData = {
      id: 'channel-123',
      name: 'Test Channel',
      description: 'Test Description',
      ownerId: 'owner-id',
      moderatorIds: ['owner-id', 'mod-id'],
      memberIds: ['owner-id', 'mod-id', 'member-id'],
      isPublic: true,
      createdAt: new Date()
    };
    
    // Act
    const channel = Channel.fromPrimitives(channelData);
    
    // Assert
    expect(channel.getId()).toBe(channelData.id);
    expect(channel.getName()).toBe(channelData.name);
    expect(channel.getDescription()).toBe(channelData.description);
    expect(channel.getOwnerId()).toBe(channelData.ownerId);
    expect(channel.getModeratorIds()).toEqual(channelData.moderatorIds);
    expect(channel.getMemberIds()).toEqual(channelData.memberIds);
    expect(channel.getIsPublic()).toBe(channelData.isPublic);
    expect(channel.getCreatedAt()).toEqual(channelData.createdAt);
  });

  it('should convert to primitives correctly', () => {
    // Arrange
    const name = 'Test Channel';
    const description = 'Test Description';
    const ownerId = 'owner-id';
    const isPublic = true;
    
    const channel = Channel.create(name, description, ownerId, isPublic);
    
    // Act
    const primitives = channel.toPrimitives();
    
    // Assert
    expect(primitives).toEqual({
      id: 'mocked-uuid',
      name,
      description,
      ownerId,
      moderatorIds: [ownerId],
      memberIds: [ownerId],
      isPublic,
      createdAt: expect.any(Date)
    });
  });
});