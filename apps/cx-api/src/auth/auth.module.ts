import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {} from '@app/shared-lib';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from 'apps/cx-api/entities/role.entity';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { UserSessionEntity } from 'apps/cx-api/entities/user-session.entity';
import { PermissionEntity } from 'apps/cx-api/entities/permission.entity';
import { OtpEntity } from 'apps/cx-api/entities/otp.entity';
import { JwtModule } from '@nestjs/jwt';
import { GuardModule } from '../guard/guard.module';
import { MailClientModule } from '../mail-client/mail-client.module';
import { ProfileEntity } from 'apps/cx-api/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      UserEntity,
      UserSessionEntity,
      PermissionEntity,
      OtpEntity,
      ProfileEntity,
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '3d' },
      }),
      inject: [ConfigService],
    }),
    GuardModule,
    MailClientModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
