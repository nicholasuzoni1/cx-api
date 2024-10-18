import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GuardService } from './guard.service';
import { UnAutherizedRequestErrorHttp } from '@app/shared-lib/http-errors';
import { LangKeys } from '@app/lang-lib/lang-keys';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly guardService: GuardService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY, // You can store the secret in config or environment variables
      passReqToCallback: true, // Enable access to the request object
    });
  }

  async validate(request: Request, payload: any) {
    // Now you can access the request object
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request); // Extract token from request

    const isSessionValid = await this.guardService.verifySesssion(token);
    // console.log('Validate', payload, isSessionValid, token);

    if (!isSessionValid) {
      throw new UnAutherizedRequestErrorHttp(
        LangKeys.UnAuthorizedErrorKey,
        'Session is invalid or token is revoked',
      );
    }

    return payload;
  }
}
