import { Pool } from 'pg';
import { Logger } from '@nestjs/common';
import { POSTGRES_POOL_PROVIDER_KEY } from 'src/config/constant';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: POSTGRES_POOL_PROVIDER_KEY,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const logger = new Logger('PostgresPoolProvider');
      try {
        const pool = new Pool({
          user: configService.get<string>('postgres.user'),
          host: configService.get<string>('postgres.host'),
          database: configService.get<string>('postgres.databaseName'),
          password: configService.get<string>('postgres.password'),
          port: configService.get<number>('postgres.port'),
        });
        await pool.connect();
        logger.log('Database connection successful');
        return pool;
      } catch (error) {
        logger.error('Database connection error', error.stack);
        throw error;
      }
    },
  },
];
