import { StdResponse, ValidationMessage } from './std-response';
import { Result } from '../../common/result';
import { Response } from 'express';
import { stdStatusToHttpStatus } from '../../common/errors/generic-error';
import { ValidationError } from 'express-validator';
import { FieldValidationError } from 'express-validator/lib/base';
import { StdStatus } from './std-status';

export function messageResponse(
  res: Response,
  message: string,
  stdStatus: StdStatus,
) {
  response<undefined>(
    res,
    new StdResponse<undefined>(undefined, message, stdStatus),
  );
}

export function badRequestResponse(res: Response, message: string) {
  response<undefined>(
    res,
    new StdResponse<undefined>(undefined, message, StdStatus.BadRequest),
  );
}

export function validationResponse(res: Response, errors: ValidationError[]) {
  let messages: ValidationMessage[] = [];

  errors.forEach((error) => {
    const tmp = error as FieldValidationError;
    messages.push({
      message: error.msg,
      field: tmp.path,
    });
  });
  response<undefined>(
    res,
    new StdResponse<undefined>(
      undefined,
      StdStatus.ValidationError,
      StdStatus.ValidationError,
      messages,
    ),
  );
}

export function noContent(res: Response) {
  res.status(204).json(null);
  return;
}

export function response<T>(
  res: Response,
  response: StdResponse<T>,
  code?: number,
) {
  sendStdResponse<T>(res, response, code);
}

export function responseResult<T>(
  res: Response,
  result: Result<T>,
  message?: string,
  code?: number,
): void {
  const stdRes = StdResponse.fromResult(result, message);

  sendStdResponse<T>(res, stdRes, code);
}

function sendStdResponse<T>(
  res: Response,
  stdRes: StdResponse<T>,
  code?: number,
): void {
  const httpCode = !code ? stdStatusToHttpStatus(stdRes.status) : code;
  res.status(httpCode).json(stdRes);
  return;
}
