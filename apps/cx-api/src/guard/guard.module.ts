import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { CommonPermissionGuard } from './guards/common-permission.guard';
import { ShipperGuard } from './guards/shipper.guard';
import { CarrierGuard } from './guards/carrier.guard';
import { AdminGuard } from './guards/admin.guard';
import { PassportModule } from '@nestjs/passport';
import { GuardService } from './guard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionEntity } from 'apps/cx-api/entities/user-session.entity';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([UserSessionEntity])],
  providers: [
    JwtStrategy,
    CommonPermissionGuard,
    ShipperGuard,
    CarrierGuard,
    AdminGuard,
    GuardService,
  ],
  exports: [
    JwtStrategy,
    CommonPermissionGuard,
    ShipperGuard,
    CarrierGuard,
    AdminGuard,
    GuardService,
  ],
})
export class GuardModule {}
