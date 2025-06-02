import * as bcrypt from 'bcrypt';

export class Password {
  private readonly value: string;

  constructor(value: string, isHashed: boolean = false) {
    if (isHashed) {
      this.value = value;
    } else {
      this.validate(value);
      this.value = this.hash(value);
    }
  }

  private validate(password: string): void {
    if (!password) {
      throw new Error('Senha é obrigatória');
    }

    if (password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    if (password.length > 100) {
      throw new Error('Senha muito longa');
    }
  }

  private hash(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  async verify(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.value);
  }

  getHash(): string {
    return this.value;
  }

  static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword, true);
  }
}
