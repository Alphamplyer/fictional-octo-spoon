import {
  Body,
  Controller,
  Inject,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import { RegisterUserUseCase } from '../usecases/register_user.usecase';
import { IRegisterUserResponse } from '../interfaces/register_user.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private registerUserUseCase: RegisterUserUseCase) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<IRegisterUserResponse> {
    return this.registerUserUseCase.execute(
      RegisterUserDto.toEntity(registerUserDto),
    );
  }

  login() {
    throw new NotImplementedException();
  }

  logout() {
    throw new NotImplementedException();
  }

  forgotPassword() {
    throw new NotImplementedException();
  }

  resetPassword() {
    throw new NotImplementedException();
  }

  changePassword() {
    throw new NotImplementedException();
  }

  refreshToken() {
    throw new NotImplementedException();
  }

  verifyEmail() {
    throw new NotImplementedException();
  }

  resendEmailVerification() {
    throw new NotImplementedException();
  }
}
