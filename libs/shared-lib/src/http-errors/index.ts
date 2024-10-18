import { LangKeys } from '@app/lang-lib/lang-keys';
import { HttpException, HttpStatus } from '@nestjs/common';

export type HttpErrorType = {
  errorMessageKey: string;
  realError: string;
};

export class InternalErrorHttp extends HttpException {
  errorCode: number;
  errorMessageKey: string;
  realError: string;
  constructor(
    errorCode: number,
    errorMessageKey: string,
    realError: string = '',
  ) {
    super(realError, errorCode);
    this.errorCode = errorCode;
    this.errorMessageKey = errorMessageKey;
    this.realError = realError;
  }
}

export class SystemErrorHttp extends InternalErrorHttp {
  constructor(err: string = '') {
    super(HttpStatus.SERVICE_UNAVAILABLE, LangKeys.SystemErrorKey, err);
  }
}

export class ValidationErrorHttp extends InternalErrorHttp {
  constructor(errorKey: string, err: string = '') {
    super(HttpStatus.BAD_REQUEST, errorKey, err);
  }
}

export class NotFoundErrorHttp extends InternalErrorHttp {
  constructor(errorKey: string, err: string = '') {
    super(HttpStatus.NOT_FOUND, errorKey, err);
  }
}

export class ForbiddenErrorHttp extends InternalErrorHttp {
  constructor(errorKey: string, err: string = '') {
    super(HttpStatus.FORBIDDEN, errorKey, err);
  }
}

export class AlreadyExistsErrorHttp extends InternalErrorHttp {
  constructor(errorKey: string, err: string = '') {
    super(HttpStatus.BAD_REQUEST, errorKey, err);
  }
}

export class BadRequestErrorHttp extends InternalErrorHttp {
  constructor(errorKey: string, err: string = '') {
    super(HttpStatus.BAD_REQUEST, errorKey, err);
  }
}

export class UnAutherizedRequestErrorHttp extends InternalErrorHttp {
  constructor(errorKey: string, err: string = '') {
    super(HttpStatus.UNAUTHORIZED, errorKey, err);
  }
}
