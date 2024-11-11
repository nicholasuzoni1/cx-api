import { Module } from '@nestjs/common';
import { LoadService } from './load.service';
import { LoadController } from './load.controller';
import { GuardModule } from '../guard/guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadEntity } from 'apps/cx-api/entities/load.entity';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { LoadDetailsEntity } from 'apps/cx-api/entities/load-details.entity';
import { BidEntity } from 'apps/cx-api/entities/bid.entity';
import { ContractEntity } from 'apps/cx-api/entities/contract.entity';

@Module({
  imports: [
    GuardModule,
    TypeOrmModule.forFeature([
      UserEntity,
      LoadEntity,
      LoadDetailsEntity,
      BidEntity,
      ContractEntity,
    ]),
  ],
  controllers: [LoadController],
  providers: [LoadService],
})
export class LoadModule {}
