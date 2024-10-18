import { Module } from '@nestjs/common';
import { LoadService } from './load.service';
import { LoadController } from './load.controller';
import { GuardModule } from '../guard/guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadEntity } from 'apps/cx-api/entities/load.entity';
import { UserEntity } from 'apps/cx-api/entities/user.entity';

@Module({
  imports: [GuardModule, TypeOrmModule.forFeature([UserEntity, LoadEntity])],
  controllers: [LoadController],
  providers: [LoadService],
})
export class LoadModule {}
