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
import { LoadDetailsEntity } from '../entities/load-details.entity';
import { BidEntity } from '../entities/bid.entity';
import { ContractEntity } from '../entities/contract.entity';
import { LoadStatusEntity } from '../entities/load-status.entity';
import { GuardModule } from './guard/guard.module';
import { LoadModule } from './load/load.module';
import { DefaultController } from './default.controller'; // Import your controller

import { BidModule } from './bid/bid.module';
import { MailClientModule } from './mail-client/mail-client.module';
import { ProfileEntity } from '../entities/profile.entity';
import { PaymentModule } from './payment/payment.module';
import { DocumentEntity } from '../entities/document.entity';
import { ProfileModule } from './profile/profile.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CostEstimationModule } from './cost-estimation/cost-estimation.module';

import { VehicleTypeEntity } from '../entities/vehicle-type.entity';
import { LoadTypeEntity } from '../entities/load-type.entity';
import { VehicleLoadTypeEntity } from '../entities/vehicle-load-type.entity';
import { SeederModule } from './seeder/seeder.module';
import { MapModule } from './map/map.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'uploads'),
      serveRoot: '/uploads',
    }),
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
      ssl:
        !!process.env.POSTGRES_SSL_DISABLED === true
          ? false
          : {
              rejectUnauthorized:
                process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED === 'true',
            },
      entities: [
        RoleEntity,
        UserEntity,
        ProfileEntity,
        UserSessionEntity,
        PermissionEntity,
        OtpEntity,
        LoadEntity,
        BidEntity,
        ContractEntity,
        LoadStatusEntity,
        //AddressEntity,
        DocumentEntity,
        LoadDetailsEntity,
        VehicleTypeEntity,
        LoadTypeEntity,
        VehicleLoadTypeEntity,
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
    MailClientModule,
    PaymentModule,
    ProfileModule,
    CostEstimationModule,
    SeederModule,
    MapModule,
  ],
  controllers: [DefaultController],
})
export class AppModule {}
