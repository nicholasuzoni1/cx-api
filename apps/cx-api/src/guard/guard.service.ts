import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSessionEntity } from 'apps/cx-api/entities/user-session.entity';
import { Repository } from 'typeorm';
import { NotFoundErrorHttp } from '@app/shared-lib/http-errors';
import { LangKeys } from '@app/lang-lib/lang-keys';
import { UserSessionResponseEntity } from './entities/user-session-response';

@Injectable()
export class GuardService {
  constructor(
    @InjectRepository(UserSessionEntity)
    private readonly userSessionEntity: Repository<UserSessionEntity>,
  ) {}

  async verifySesssion(session: string) {
    try {
      const res = await this.getUserSession(session);

      if (res) {
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }

  async getUserSession(session: string) {
    try {
      const userSession = await this.userSessionEntity.findOneBy({
        token: session,
      });
      if (!userSession) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      const output = new UserSessionResponseEntity();
      output.id = userSession.id;
      output.token = userSession.token;
      output.userId = userSession.user_id;
      output.expiresAt = userSession.expires_at.toISOString();
      output.createdAt = userSession.created_at.toISOString();
      output.updatedAt = userSession.updated_at.toISOString();
      output.deletedAt = userSession.deleted_at?.toISOString();

      return output;
    } catch (error) {
      throw error;
    }
  }
}
