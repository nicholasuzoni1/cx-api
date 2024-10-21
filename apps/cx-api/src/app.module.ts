import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from '../entities/otp.entity';
import { PermissionEntity } from '../entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';
import { UserSessionEntity } from '../entities/user-session.entity';
import { UserEntity } from '../entities/user.entity';
import { LoadEntity } from '../entities/load.entity';
import { BidEntity } from '../entities/bid.entity';
import { ContractEntity } from '../entities/contract.entity';
import { LoadStatusEntity } from '../entities/load-status.entity';
import { GuardModule } from './guard/guard.module';
import { LoadModule } from './load/load.module';
import { DefaultController } from './default.controller'; // Import your controller

import { BidModule } from './bid/bid.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DevtoolsModule.register({
      port: Number(process.env.DEVTOOLS_PORT),
      http: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT
        ? parseInt(process.env.POSTGRES_PORT)
        : 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [
        RoleEntity,
        UserEntity,
        UserSessionEntity,
        PermissionEntity,
        OtpEntity,
        LoadEntity,
        BidEntity,
        ContractEntity,
        LoadStatusEntity,
      ],
      synchronize: !!process.env.POSTGRES_DB_SYNC,
      useUTC: true,
    }),
    AuthModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    GuardModule,
    LoadModule,
    BidModule,
  ],
  controllers: [DefaultController],
})
export class AppModule {}
