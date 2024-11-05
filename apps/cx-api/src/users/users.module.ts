import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { UserSessionEntity } from 'apps/cx-api/entities/user-session.entity';
import { OtpEntity } from 'apps/cx-api/entities/otp.entity';
import { RoleEntity } from 'apps/cx-api/entities/role.entity';
import { GuardModule } from '../guard/guard.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    GuardModule,
    TypeOrmModule.forFeature([
      UserEntity,
      UserSessionEntity,
      OtpEntity,
      RoleEntity,
    ]),
    PaymentModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
