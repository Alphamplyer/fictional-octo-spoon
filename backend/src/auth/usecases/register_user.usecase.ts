import { Pool, PoolClient, QueryResult } from 'pg';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { POSTGRES_POOL_PROVIDER_KEY } from 'src/config/constant';
import { IUseCase } from 'src/core/interfaces/usecase.interface';
import { PasswordService } from '../services/password.service';
import {
  IRegisterUserLoginData,
  IRegisterUserParams,
  IRegisterUserProfile,
  IRegisterUserResponse,
} from '../interfaces/register_user.interface';
import { HashingAlgorithm } from '../entities/hashing_algorithm.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailValidationStatus } from '../entities/email_validation_status.entity';

@Injectable()
export class RegisterUserUseCase
  implements IUseCase<IRegisterUserParams, IRegisterUserResponse>
{
  constructor(
    @Inject(POSTGRES_POOL_PROVIDER_KEY) private pool: Pool,
    @Inject() private passwordService: PasswordService,
    @Inject() private jwtService: JwtService,
    @Inject() private configService: ConfigService,
  ) {}

  async execute(params: IRegisterUserParams): Promise<IRegisterUserResponse> {
    const client = await this.pool.connect();

    try {
      // Begin transaction
      await client.query('BEGIN');

      await this.checkAndThrowErrorIfUsernameOrEmailAlreadyInUse(
        params.email,
        params.username,
        client,
      );

      // Insert user profile
      const computedUserProfile: IRegisterUserProfile =
        this.computeUserProfile(params);
      const persistUserProfileResult = await this.insertUserProfile(
        computedUserProfile,
        client,
      );
      const persitedUserProfile = persistUserProfileResult.rows[0];

      // Insert user login data
      const computedUserLoginData: IRegisterUserLoginData =
        await this.computeUserLoginData(params, persitedUserProfile.id);
      const persistUserLoginDataResult = await this.insertUserLoginData(
        computedUserLoginData,
        client,
      );
      const persistedUserLoginData = persistUserLoginDataResult.rows[0];

      // Commit transaction
      await client.query('COMMIT');

      return {
        username: persistedUserLoginData.username,
        email: persistedUserLoginData.email,
        userProfile: persitedUserProfile,
        jwt: await this.jwtService.signAsync({
          user_id: persitedUserProfile.id,
          email: persistedUserLoginData.email,
          username: persistedUserLoginData.username,
        }),
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async checkAndThrowErrorIfUsernameOrEmailAlreadyInUse(
    email: string,
    username: string,
    client: PoolClient,
  ) {
    const existingUsernameOrEmailQuery = await client.query(
      'SELECT * FROM user_login_data WHERE email = $1 OR username = $2',
      [email, username],
    );

    if (existingUsernameOrEmailQuery.rows.length > 0) {
      throw new HttpException(
        'username_or_email_already_exists',
        HttpStatus.CONFLICT,
      );
    }
  }

  private computeUserProfile(
    params: IRegisterUserParams,
  ): IRegisterUserProfile {
    return {
      accept_terms_of_service: params.accept_terms_of_service,
      time_zone: params.time_zone,
    };
  }

  private async insertUserProfile(
    userProfile: IRegisterUserProfile,
    client: PoolClient,
  ): Promise<QueryResult<any>> {
    return await client.query(
      'INSERT INTO user_profiles (accept_terms_of_service, time_zone) VALUES ($1, $2) RETURNING *',
      [userProfile.accept_terms_of_service, userProfile.time_zone],
    );
  }

  private async computeUserLoginData(
    params: IRegisterUserParams,
    userId: number,
  ): Promise<IRegisterUserLoginData> {
    const hashedPassword = await this.passwordService.hash(params.password);
    if (hashedPassword === null) {
      throw new HttpException(
        'something_went_wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      user_id: userId,
      email: params.email,
      username: params.username,
      password_hash: hashedPassword,
      password_hashing_algorithm_id:
        HashingAlgorithm[
          this.configService
            .get<string>('passwordHashing.hashingAlgorithm')
            .toUpperCase()
        ],
      email_validation_status_id: EmailValidationStatus.PENDING,
      registration_time: new Date(),
    };
  }

  private async insertUserLoginData(
    userLoginData: IRegisterUserLoginData,
    client: PoolClient,
  ): Promise<QueryResult<any>> {
    return await client.query(
      'INSERT INTO user_login_data ' +
        '(user_id, email, username, password_hash, password_hashing_algorithm_id, email_validation_status_id, registration_time) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7) ' +
        'RETURNING user_id, email, username, email_validation_status_id, registration_time',
      [
        userLoginData.user_id,
        userLoginData.email,
        userLoginData.username,
        userLoginData.password_hash,
        userLoginData.password_hashing_algorithm_id,
        userLoginData.email_validation_status_id,
        userLoginData.registration_time,
      ],
    );
  }
}
