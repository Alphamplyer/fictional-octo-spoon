import { IConfig } from './interfaces/config.interface';

export const config = (): IConfig => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  postgres: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    databaseName: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    schema: process.env.DB_SCHEMA,
  },
  passwordHashing: {
    hashingAlgorithm: process.env.HASHING_ALGORITHM || 'scrypt',
    scrypt: {
      keyLength: parseInt(process.env.SCRYPT_KEY_LENGTH, 10) || 64,
      saltLength: parseInt(process.env.SCRYPT_SALT_LENGTH, 10) || 32,
    },
  },
});
