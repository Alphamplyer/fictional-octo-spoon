import { IRegisterUserParams } from '../interfaces/register_user.interface';

export class RegisterUserDto {
  username: string;
  email: string;
  password: string;
  accept_terms_of_service: boolean;
  time_zone: string;

  static toEntity(dto: RegisterUserDto): IRegisterUserParams {
    return {
      username: dto.username,
      email: dto.email,
      password: dto.password,
      accept_terms_of_service: dto.accept_terms_of_service,
      time_zone: dto.time_zone,
    };
  }
}
