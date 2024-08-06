import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegisterUserUseCase } from './usecases/register_user.usecase';
import { PasswordService } from './services/password.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  providers: [RegisterUserUseCase, PasswordService],
  controllers: [AuthController],
})
export class AuthModule {}
