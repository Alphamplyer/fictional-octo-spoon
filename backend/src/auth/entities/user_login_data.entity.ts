export class UserLoginData {
  userId: number;
  username: string;
  email: string;

  passwordHash: string;
  hashingPasswordAlgorithmId: number;

  confirmationToken: string;
  tokenGenerationTime: Date;

  emailValidationStatusId: number;

  passwordRecorveryToken: string;
  passwordRecoveryTokenGenerationTime: Date;

  registrationTime: Date;
}
