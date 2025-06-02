export class AccountResponseDto {
  id: string;
  email: string;
  characters: string[];
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;

  constructor(data: {
    id: string;
    email: string;
    characters: string[];
    isActive: boolean;
    createdAt: Date;
    lastLogin?: Date;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.characters = data.characters;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.lastLogin = data.lastLogin;
  }
}
