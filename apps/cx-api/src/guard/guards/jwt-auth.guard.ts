import { LangKeys } from '@app/lang-lib/lang-keys';
import { UnAutherizedRequestErrorHttp } from '@app/shared-lib/http-errors';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      // Instead of throwing default UnauthorizedException, throw your custom error
      throw new UnAutherizedRequestErrorHttp(
        LangKeys.UnAuthorizedErrorKey,
        'Invalid token or unauthorized access.',
      );
    }
    return user;
  }
}
