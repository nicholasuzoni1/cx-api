import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JsonResponseType } from '@app/shared-lib/json-response';
import { LangKeys } from '@app/lang-lib/lang-keys';
import { LangTranslator, LangType } from '@app/lang-lib/lang-translator';
import { InternalErrorHttp } from '@app/shared-lib/http-errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Construct the custom response
    const errorResponse: JsonResponseType = {
      data: null,
      message: LangKeys.SomethingWentWrongKey,
      realError: '',
      status: 'error',
    };

    console.log('Error', exception);
    if (exception instanceof InternalErrorHttp) {
      errorResponse.message = exception.errorMessageKey;
      errorResponse.realError = exception.realError;
    }

    // Translate Error Message
    errorResponse.message = LangTranslator(
      errorResponse.message,
      request.headers['lang'] as LangType,
    );

    // Send the custom response
    response.status(status).json(errorResponse);
  }
}
