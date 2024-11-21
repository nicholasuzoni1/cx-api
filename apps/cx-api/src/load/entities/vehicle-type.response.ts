import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { VehicleLoadTypesResponseEntity } from './load-type.respose';

export class VehicleTypeResponseEntity {
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'The id of vehicle type',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'The name of vehicle type',
    example: 'Vehicly type name',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The description of vehicle type',
    example: 'Vehicly type name',
  })
  description: string;

  @ApiProperty({
    type: [VehicleLoadTypesResponseEntity],
    description: 'Vehicle type load details',
    example: [
      {
        rate_per_mile: 75,
        load_type: {
          id: 1,
          name: 'Heavy Machinery',
          description: 'construction equipment, industrial tools',
        },
      },
      {
        rate_per_mile: 24,
        load_type: {
          id: 2,
          name: 'Building Materials',
          description: 'steel, lumber, concrete',
        },
      },
      {
        rate_per_mile: 54,
        load_type: {
          id: 3,
          name: 'Oversized Cargo',
          description: 'large pipes, wind turbine parts',
        },
      },
    ],
  })
  vehicleLoadTypes: Array<VehicleLoadTypesResponseEntity>;

  @ApiProperty({
    type: String,
    description: 'Id of creator',
  })
  createdBy?: number;

  @ApiProperty({
    type: String,
    description: 'Time of creation',
  })
  createdAt?: string;

  @ApiProperty({
    type: String,
    description: 'Time of updation',
  })
  updatedAt?: string;

  @ApiProperty({
    type: String,
    description: 'Time of deletion',
  })
  deletedAt?: string;
}
