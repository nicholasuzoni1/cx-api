import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { LoadTypeEntity } from 'apps/cx-api/entities/load-type.entity';
import { VehicleTypeEntity } from 'apps/cx-api/entities/vehicle-type.entity';
import { VehicleLoadTypeEntity } from 'apps/cx-api/entities/vehicle-load-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleTypeEntity,
      LoadTypeEntity,
      VehicleLoadTypeEntity,
    ]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
