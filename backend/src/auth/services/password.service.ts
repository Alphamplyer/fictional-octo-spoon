import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { IPasswordHashingConfig } from 'src/config/interfaces/config.interface';
import { HashingAlgorithm } from '../entities/hashing_algorithm.entity';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);
  private readonly passwordHashingConfig: IPasswordHashingConfig;

  constructor(private configService: ConfigService) {
    this.passwordHashingConfig =
      this.configService.get<IPasswordHashingConfig>('passwordHashing');
  }

  /**
   * Has a password or a secret with the defined password hashing algorithm in the config
   * @param {string} password The password to hash
   * @returns {string} The hashed password
   */
  async hash(password): Promise<string | null> {
    if (
      HashingAlgorithm[
        this.passwordHashingConfig.hashingAlgorithm.toUpperCase()
      ] === HashingAlgorithm.SCRYPT
    ) {
      return this.hashWithScrypt(password);
    }
    this.logger.error('Unsupported hashing algorithm');
    return null;
  }

  async hashWithScrypt(password): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(
        this.passwordHashingConfig.scrypt.saltLength,
      ).toString('hex');
      scrypt(
        password,
        salt,
        this.passwordHashingConfig.scrypt.saltLength,
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(`${salt}.${derivedKey.toString('hex')}`);
        },
      );
    });
  }

  /**
   * Compare a plain text password with a salt+hash password
   * @param {string} password The plain text password
   * @param {string} hash The hash+salt to check against
   * @returns {boolean} True if the password is correct, false otherwise
   */
  async compare(password, hash, algorithm) {
    if (algorithm === HashingAlgorithm.SCRYPT) {
      return this.compareWithScrypt(password, hash);
    }
    this.logger.error('Unsupported hashing algorithm');
    return false;
  }

  async compareWithScrypt(password, hash) {
    return new Promise((resolve, reject) => {
      const [salt, hashKey] = hash.split('.');
      const hashKeyBuff = Buffer.from(hashKey, 'hex');
      scrypt(
        password,
        salt,
        this.passwordHashingConfig.scrypt.keyLength,
        (err, derivedKey) => {
          if (err) reject(err);
          // compare the new supplied password with the hashed password using timeSafeEqual
          // to prevent timing attacks
          resolve(timingSafeEqual(hashKeyBuff, derivedKey));
        },
      );
    });
  }
}
