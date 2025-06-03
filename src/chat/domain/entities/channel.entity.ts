import { v4 as uuidv4 } from 'uuid';

export class Channel {
  private readonly id: string;
  private name: string;
  private description: string;
  private readonly ownerId: string;
  private moderatorIds: string[];
  private memberIds: string[];
  private readonly isPublic: boolean;
  private readonly createdAt: Date;

  private constructor(
    id: string,
    name: string,
    description: string,
    ownerId: string,
    moderatorIds: string[],
    memberIds: string[],
    isPublic: boolean,
    createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.ownerId = ownerId;
    this.moderatorIds = moderatorIds;
    this.memberIds = memberIds;
    this.isPublic = isPublic;
    this.createdAt = createdAt;

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim() === '') {
      throw new Error('Nome do canal não pode ser vazio');
    }

    if (this.name.length > 50) {
      throw new Error('Nome do canal muito longo (máximo 50 caracteres)');
    }

    if (this.description && this.description.length > 500) {
      throw new Error('Descrição do canal muito longa (máximo 500 caracteres)');
    }
  }

  static create(
    name: string,
    description: string,
    ownerId: string,
    isPublic: boolean = true,
  ): Channel {
    return new Channel(
      uuidv4(),
      name,
      description,
      ownerId,
      [ownerId], // Owner is automatically a moderator
      [ownerId], // Owner is automatically a member
      isPublic,
      new Date(),
    );
  }

  static fromPrimitives(data: {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    moderatorIds: string[];
    memberIds: string[];
    isPublic: boolean;
    createdAt: Date;
  }): Channel {
    return new Channel(
      data.id,
      data.name,
      data.description,
      data.ownerId,
      data.moderatorIds,
      data.memberIds,
      data.isPublic,
      data.createdAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  getModeratorIds(): string[] {
    return [...this.moderatorIds];
  }

  getMemberIds(): string[] {
    return [...this.memberIds];
  }

  getIsPublic(): boolean {
    return this.isPublic;
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  updateName(name: string): void {
    this.name = name;
    this.validate();
  }

  updateDescription(description: string): void {
    this.description = description;
    this.validate();
  }

  addMember(userId: string): void {
    if (!this.memberIds.includes(userId)) {
      this.memberIds.push(userId);
    }
  }

  removeMember(userId: string): void {
    if (userId === this.ownerId) {
      throw new Error('Não é possível remover o dono do canal');
    }
    
    this.memberIds = this.memberIds.filter(id => id !== userId);
    
    // If user was a moderator, remove from moderators as well
    this.removeModerator(userId);
  }

  addModerator(userId: string): void {
    if (!this.memberIds.includes(userId)) {
      throw new Error('O usuário deve ser membro do canal para se tornar moderador');
    }

    if (!this.moderatorIds.includes(userId)) {
      this.moderatorIds.push(userId);
    }
  }

  removeModerator(userId: string): void {
    if (userId === this.ownerId) {
      throw new Error('Não é possível remover o dono como moderador');
    }
    
    this.moderatorIds = this.moderatorIds.filter(id => id !== userId);
  }

  isMember(userId: string): boolean {
    return this.memberIds.includes(userId);
  }

  isModerator(userId: string): boolean {
    return this.moderatorIds.includes(userId);
  }

  isOwner(userId: string): boolean {
    return this.ownerId === userId;
  }

  canSendMessage(userId: string): boolean {
    return this.isMember(userId);
  }

  canModerate(userId: string): boolean {
    return this.isModerator(userId) || this.isOwner(userId);
  }

  toPrimitives(): {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    moderatorIds: string[];
    memberIds: string[];
    isPublic: boolean;
    createdAt: Date;
  } {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      ownerId: this.ownerId,
      moderatorIds: this.moderatorIds,
      memberIds: this.memberIds,
      isPublic: this.isPublic,
      createdAt: this.createdAt,
    };
  }
}
