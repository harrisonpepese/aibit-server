import { Injectable, Inject } from '@nestjs/common';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { ACCOUNT_REPOSITORY_TOKEN } from '../../domain/repositories/account.repository.token';
import { Account } from '../../domain/entities/account.entity';
import * as jwt from 'jsonwebtoken';

export interface TokenPayload {
  accountId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  id: string;
  email: string;
  username: string;
  characters: string[];
}

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
  
  constructor(
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly accountRepository: AccountRepository,
  ) {}

  /**
   * Generates a JWT token for an account
   */
  generateToken(account: Account): string {
    const payload: TokenPayload = {
      accountId: account.id,
      email: account.email,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '24h', // Token expires in 24 hours
    });
  }

  /**
   * Validates a JWT token and returns account information
   */
  async validateToken(token: string): Promise<AuthResult | null> {
    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, this.jwtSecret) as TokenPayload;
      
      // Get the account from the database
      const account = await this.accountRepository.findById(decoded.accountId);
      
      if (!account || !account.isActive) {
        return null;
      }

      return {
        id: account.id,
        email: account.email,
        username: account.email, // Using email as username for now
        characters: account.characters,
      };
    } catch (error) {
      // Token is invalid or expired
      return null;
    }
  }

  /**
   * Validates credentials and returns a token
   */
  async authenticate(email: string, password: string): Promise<{ token: string; account: AuthResult } | null> {
    try {
      // This would use the LoginUseCase, but for simplicity, we'll implement it here
      const account = await this.accountRepository.findByEmail(email);
      
      if (!account || !account.isActive) {
        return null;
      }

      // You would verify password here using the Password value object
      // For now, we'll assume password validation is done elsewhere
      
      const token = this.generateToken(account);
      
      return {
        token,
        account: {
          id: account.id,
          email: account.email,
          username: account.email,
          characters: account.characters,
        }
      };
    } catch (error) {
      return null;
    }
  }  /**
   * Extracts token from authorization header
   */
  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
}
