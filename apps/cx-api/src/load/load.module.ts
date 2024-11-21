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
import { VehicleTypeEntity } from 'apps/cx-api/entities/vehicle-type.entity';
import { LoadTypeEntity } from 'apps/cx-api/entities/load-type.entity';
import { VehicleLoadTypeEntity } from 'apps/cx-api/entities/vehicle-load-type.entity';
import { CostEstimationModule } from '../cost-estimation/cost-estimation.module';
import { CostEstimationService } from '../cost-estimation/cost-estimation.service';

@Module({
  imports: [
    GuardModule,
    CostEstimationModule,
    TypeOrmModule.forFeature([
      UserEntity,
      LoadEntity,
      LoadDetailsEntity,
      BidEntity,
      ContractEntity,
      VehicleTypeEntity,
      LoadTypeEntity,
      VehicleLoadTypeEntity,
    ]),
  ],
  controllers: [LoadController],
  providers: [LoadService, CostEstimationService],
})
export class LoadModule {}
