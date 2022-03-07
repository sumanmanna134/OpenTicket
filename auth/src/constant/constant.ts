const APP_BASE_URL = '/api/';
export abstract class ApiConstant {
  static EMAIL_ALREADY_INUSE: string = 'Email already in use!';
  static INVALID_EMAIL: string = 'Email must be valid';
  static INVALID_PASSWORD: string =
    'Password must be between 4 and 20 characters';
  static ACCOUNT_CREATION_FAILED: string =
    'Account creation failed! please try after some time !';
}
