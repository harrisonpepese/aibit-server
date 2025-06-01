export class Account {
  private constructor(
    private readonly _id: string,
    private _email: string,
    private _passwordHash: string,
    private readonly _createdAt: Date,
    private _characters: string[] = [],
    private _isActive: boolean = true,
    private _lastLogin?: Date,
  ) {}

  static create(
    id: string,
    email: string,
    passwordHash: string,
    createdAt: Date = new Date(),
  ): Account {
    return new Account(id, email, passwordHash, createdAt);
  }

  static fromPrimitives(data: {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    characters?: string[];
    isActive?: boolean;
    lastLogin?: Date;
  }): Account {
    return new Account(
      data.id,
      data.email,
      data.passwordHash,
      data.createdAt,
      data.characters || [],
      data.isActive ?? true,
      data.lastLogin,
    );
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get characters(): string[] {
    return [...this._characters];
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get lastLogin(): Date | undefined {
    return this._lastLogin;
  }

  updateEmail(newEmail: string): void {
    this._email = newEmail;
  }

  updatePasswordHash(newPasswordHash: string): void {
    this._passwordHash = newPasswordHash;
  }

  addCharacter(characterId: string): void {
    if (!this._characters.includes(characterId)) {
      this._characters.push(characterId);
    }
  }

  removeCharacter(characterId: string): void {
    this._characters = this._characters.filter(id => id !== characterId);
  }

  deactivate(): void {
    this._isActive = false;
  }

  activate(): void {
    this._isActive = true;
  }

  updateLastLogin(): void {
    this._lastLogin = new Date();
  }

  toPrimitives(): {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    characters: string[];
    isActive: boolean;
    lastLogin?: Date;
  } {
    return {
      id: this._id,
      email: this._email,
      passwordHash: this._passwordHash,
      createdAt: this._createdAt,
      characters: this._characters,
      isActive: this._isActive,
      lastLogin: this._lastLogin,
    };
  }
}
