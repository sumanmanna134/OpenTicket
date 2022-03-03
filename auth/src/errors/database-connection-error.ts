import { CustomError } from './custom-error';
export class DatabaseConnectionError extends CustomError {
  statusCode: number = 500;
  reason = 'Error connecting to database';
  constructor() {
    super('');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): { message: String; field?: string | undefined }[] {
    return [{ message: this.reason }];
  }
}
