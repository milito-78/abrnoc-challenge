import { StdStatus } from '../../infrastructure/http/std-status';

export enum GenericErrorCode {
  INTERNAL = 1,
  NOT_FOUND = 2,
  INVALID_ARGUMENT = 3,
  FORBIDDEN = 4,
  UNAUTHORIZED = 5,
  VALIDATION_ERROR = 6,
}

export function stdStatusToHttpStatus(status: StdStatus): number {
  switch (status) {
    case StdStatus.Success:
      return 200;
    case StdStatus.NotFound:
      return 404;
    case StdStatus.ValidationError:
      return 422;
    case StdStatus.BadRequest:
      return 400;
    case StdStatus.UNAUTHORIZED:
      return 401;
    case StdStatus.PermissionDenied:
      return 403;
    case StdStatus.InternalError:
    default:
      return 500;
  }
}

export function genericCodeToStdStatus(code: GenericErrorCode): StdStatus {
  switch (code) {
    case GenericErrorCode.NOT_FOUND:
      return StdStatus.NotFound;
    case GenericErrorCode.VALIDATION_ERROR:
      return StdStatus.ValidationError;
    case GenericErrorCode.INVALID_ARGUMENT:
      return StdStatus.BadRequest;
    case GenericErrorCode.FORBIDDEN:
      return StdStatus.PermissionDenied;
    case GenericErrorCode.UNAUTHORIZED:
      return StdStatus.UNAUTHORIZED;
    default:
      return StdStatus.InternalError;
  }
}

export function genericCodeToHttpStatus(code: GenericErrorCode): number {
  switch (code) {
    case GenericErrorCode.NOT_FOUND:
      return 404;
    case GenericErrorCode.VALIDATION_ERROR:
      return 422;
    case GenericErrorCode.INVALID_ARGUMENT:
      return 400;
    case GenericErrorCode.FORBIDDEN:
      return 403;
    case GenericErrorCode.UNAUTHORIZED:
      return 401;
    case GenericErrorCode.INTERNAL:
    default:
      return 500;
  }
}

export class GenericError {
  code: GenericErrorCode;
  message: string;
  err: Error;
  data: any;

  constructor(err: Error | any, code?: GenericErrorCode, data?: any) {
    if (err instanceof Error) {
      this.err = err;
      this.message = err.message;
    } else {
      this.message = err;
      this.err = err;
    }
    this.data = data;
    this.code = code || GenericErrorCode.INTERNAL;
  }
}
