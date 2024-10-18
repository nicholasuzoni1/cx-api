import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from 'apps/cx-api/entities/permission.entity';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { GuardModule } from '../guard/guard.module';
import { RoleEntity } from 'apps/cx-api/entities/role.entity';

@Module({
  imports: [
    GuardModule,
    TypeOrmModule.forFeature([PermissionEntity, UserEntity, RoleEntity]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
