import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from 'apps/cx-api/entities/permission.entity';
import { RoleEntity } from 'apps/cx-api/entities/role.entity';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { UserSessionEntity } from 'apps/cx-api/entities/user-session.entity';
import { GuardModule } from '../guard/guard.module';

@Module({
  imports: [
    GuardModule,
    TypeOrmModule.forFeature([
      PermissionEntity,
      RoleEntity,
      UserEntity,
      UserSessionEntity,
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
