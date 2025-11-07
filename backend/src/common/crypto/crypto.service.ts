import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const HASH_ROUNDS = 10;

@Injectable()
export class CryptoService {
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, HASH_ROUNDS);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    if (!hash) {
      return false;
    }
    return bcrypt.compare(plainText, hash);
  }

  /**
   * (SHA256) Gera um hash determinístico. (Para tokens)
   * A mesma entrada SEMPRE gera a mesma saída.
   */
  hashSha256(plainText: string): string {
    return crypto.createHash('sha256').update(plainText).digest('hex');
  }

  /**
   * Gera um token aleatório e seguro em formato hexadecimal.
   * (Para tokens de reset de senha, verificação de e-mail, etc.)
   */
  generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
