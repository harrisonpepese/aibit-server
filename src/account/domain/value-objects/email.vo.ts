export class Email {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      throw new Error('Email é obrigatório');
    }

    if (!emailRegex.test(email)) {
      throw new Error('Formato de email inválido');
    }

    if (email.length > 255) {
      throw new Error('Email muito longo');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
