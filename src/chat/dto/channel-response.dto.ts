export class ChannelResponseDto {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  moderatorIds: string[];
  memberIds: string[];
  isPublic: boolean;
  createdAt: Date;

  constructor(data: {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    moderatorIds: string[];
    memberIds: string[];
    isPublic: boolean;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.ownerId = data.ownerId;
    this.moderatorIds = data.moderatorIds;
    this.memberIds = data.memberIds;
    this.isPublic = data.isPublic;
    this.createdAt = data.createdAt;
  }
}