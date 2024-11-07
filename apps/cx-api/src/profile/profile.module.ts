import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { GuardModule } from '../guard/guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from 'apps/cx-api/entities/profile.entity';

@Module({
  imports: [GuardModule, TypeOrmModule.forFeature([ProfileEntity])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
