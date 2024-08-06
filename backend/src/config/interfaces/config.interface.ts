interface IPostgresConfig {
  user: string;
  host: string;
  databaseName: string;
  password: string;
  port: number;
  schema: string;
}

interface IJwtConfig {
  secret: string;
  expiresIn: string;
}

export interface IPasswordHashingConfig {
  hashingAlgorithm: string;
  scrypt: IScryptConfig;
}

export interface IScryptConfig {
  keyLength: number;
  saltLength: number;
}

export interface IConfig {
  port: number;
  jwt: IJwtConfig;
  postgres: IPostgresConfig;
  passwordHashing: IPasswordHashingConfig;
}
