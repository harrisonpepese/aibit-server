export class CharacterName {
  private readonly value: string;

  constructor(name: string) {
    this.validate(name);
    this.value = name.trim();
  }

  private validate(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome do personagem é obrigatório');
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
      throw new Error('Nome do personagem deve ter pelo menos 3 caracteres');
    }

    if (trimmedName.length > 20) {
      throw new Error('Nome do personagem deve ter no máximo 20 caracteres');
    }

    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)) {
      throw new Error('Nome do personagem deve conter apenas letras e espaços');
    }

    // Verifica se não contém apenas espaços
    if (!/[a-zA-ZÀ-ÿ]/.test(trimmedName)) {
      throw new Error('Nome do personagem deve conter pelo menos uma letra');
    }

    // Verifica palavras proibidas (lista básica)
    const forbiddenWords = ['admin', 'moderator', 'god', 'gm', 'gamemaster'];
    const lowerName = trimmedName.toLowerCase();
    
    for (const forbidden of forbiddenWords) {
      if (lowerName.includes(forbidden)) {
        throw new Error('Nome do personagem contém palavra não permitida');
      }
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: CharacterName): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  toString(): string {
    return this.value;
  }
}
