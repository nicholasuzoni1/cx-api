import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostEstimationService } from './cost-estimation.service';
import { VehicleLoadTypeEntity } from 'apps/cx-api/entities/vehicle-load-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleLoadTypeEntity])],
  providers: [CostEstimationService],
})
export class CostEstimationModule {}
