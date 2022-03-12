import { CustomError } from './custom-error';
export class UnAuthorizedError extends CustomError {
  statusCode: number = 401;
  constructor() {
    super('Not Authorized!');
    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }
  serializeErrors(): { message: String; field?: string | undefined }[] {
    return [
      {
        message: 'Oops! Authorized, Please try after login ',
      },
    ];
  }
}
