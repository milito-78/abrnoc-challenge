import { Result } from '../../common/result';
import { StdStatus } from './std-status';
import { genericCodeToStdStatus } from '../../common/errors/generic-error';

export interface ValidationMessage {
  message: string;
  field: string;
}

export class StdResponse<T> {
  public status: StdStatus;

  public message: string;

  public data?: T;

  public errors: ValidationMessage[];

  constructor(
    data: T,
    message: string,
    status: string,
    errs?: ValidationMessage[],
  ) {
    this.status = status as StdStatus;
    this.message = message;
    this.data = data;
    this.errors = errs;
  }

  static fromResult<T>(result: Result<T>, message?: string): StdResponse<T> {
    if (result.isOk()) {
      return new StdResponse<T>(result.value, message ?? '', StdStatus.Success);
    }

    return new StdResponse<T>(
      result.err.data,
      message ??
        (result.err.message == ''
          ? genericCodeToStdStatus(result.err.code)
          : result.err.message),
      genericCodeToStdStatus(result.err.code),
    );
  }
}
