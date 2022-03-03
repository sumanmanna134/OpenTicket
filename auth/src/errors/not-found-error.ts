import { CustomError } from './custom-error';
export class NotFoundError extends CustomError {
  statusCode: number = 404;
  constructor() {
    super('Route not Found!');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors(): { message: String; field?: string | undefined }[] {
    return [
      {
        message: 'Not Found',
      },
    ];
  }
}
