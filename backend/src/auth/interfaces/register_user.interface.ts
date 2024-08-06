import { UserProfile } from '../entities/user_profile.entity';

export interface IRegisterUser {
  userProfile: IRegisterUserProfile;
  userLoginData: IRegisterUserLoginData;
}

export interface IRegisterUserLoginData {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  password_hashing_algorithm_id: number;
  email_validation_status_id: number;
  registration_time: Date;
}

export interface IRegisterUserProfile {
  accept_terms_of_service: boolean;
  time_zone: string;
}

export interface IRegisterUserParams {
  username: string;
  email: string;
  password: string;
  accept_terms_of_service: boolean;
  time_zone: string;
}

export interface IRegisterUserResponse {
  username: string;
  email: string;
  userProfile: UserProfile;
  jwt: string;
}
