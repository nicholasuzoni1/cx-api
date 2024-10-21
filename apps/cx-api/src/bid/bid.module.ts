import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { GuardModule } from '../guard/guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { LoadEntity } from 'apps/cx-api/entities/load.entity';
import { BidEntity } from 'apps/cx-api/entities/bid.entity';

@Module({
  imports: [
    GuardModule,
    TypeOrmModule.forFeature([UserEntity, LoadEntity, BidEntity]),
  ],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
