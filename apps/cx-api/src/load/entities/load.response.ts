export class Load {}
import {
  Dimension_Unit_Names,
  Dimension_Unit_Type,
} from '@app/load-managment/dimension-types';
import {
  Vehicle_Type,
  Vehicle_Type_Names,
} from '@app/load-managment/vehicle-types';
import {
  Weight_Unit_Names,
  Weight_Unit_Type,
} from '@app/load-managment/weight-types';
import { ApiProperty } from '@nestjs/swagger';
import { LoadTypeEntity } from 'apps/cx-api/entities/load-type.entity';
import { VehicleTypeEntity } from 'apps/cx-api/entities/vehicle-type.entity';
import { IsNumber } from 'class-validator';

class LoadDimensionsResponseEntity {
  @ApiProperty({ description: 'The length of the load', example: 10 })
  length: number;

  @ApiProperty({ description: 'The width of the load', example: 10 })
  width: number;

  @ApiProperty({ description: 'The height of the load', example: 5 })
  height: number;
}

class LoadLocationResponseEntity {
  @ApiProperty({
    description: 'The address of the location',
    example: '123 Main St',
  })
  address: string;
  @ApiProperty({
    description: 'The latitude of the location',
    example: 40.7128,
  })
  lat: number;

  @ApiProperty({
    description: 'The longitude of the location',
    example: -74.006,
  })
  lng: number;
}

export class LoadDetailsResponseEntity {
  @IsNumber()
  @ApiProperty({
    description: 'The id of sub load',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Load UUID',
    example: 'Unique String',
  })
  loadUid: string;

  @ApiProperty({
    description: 'The title of load',
    example: 'title',
  })
  title: string;

  @ApiProperty({
    description: 'The unit of load',
    example: Weight_Unit_Names.kg,
  })
  weightUnit: Weight_Unit_Type;

  @ApiProperty({
    description: 'The weight of load',
    example: 50,
  })
  weight: number;

  @ApiProperty({
    description: 'The dimesion unit for load',
    example: Dimension_Unit_Names.cm,
  })
  dimensionUnit: Dimension_Unit_Type;

  @ApiProperty({
    description: 'The dimensions of the load',
    example: {
      length: 10,
      width: 10,
      height: 5,
    },
  })
  dimensions: LoadDimensionsResponseEntity;

  @ApiProperty({
    description: 'The vehicle tyoe',
    example: Vehicle_Type_Names['Dry Van'],
  })
  vehicleType: VehicleTypeEntity;

  @ApiProperty({
    description: 'The type of load',
    example: 'Briefly descripe your load',
  })
  loadType: LoadTypeEntity;

  @ApiProperty({
    type: String,
    description: 'Total milage for the stop-over',
  })
  milage?: string;

  @ApiProperty({
    description: 'The pickup location details',
    example: {
      address: '123 Main St',
      lat: 31.509635,
      lng: 74.341322,
    },
  })
  pickupLocation: LoadLocationResponseEntity;

  @ApiProperty({
    description: 'The pickup date of the load',
    example: '2024-10-17T12:00:00Z',
  })
  pickupDateTime: string;

  @ApiProperty({
    description: 'The destination location details',
    example: {
      address: '123 Main St',
      lat: 31.474495,
      lng: 74.402423,
    },
  })
  destinationLocation: LoadLocationResponseEntity;

  @ApiProperty({
    description: 'The arrival datetime of the load',
    example: '2024-12-17T12:00:00Z',
  })
  arrivalDateTime: string;

  @ApiProperty({
    description: 'The status of sub load',
    example: 'draft',
  })
  status: string;

  @ApiProperty({
    description: 'Order of sub load',
    example: '1',
  })
  order: number;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  estimatedBudget?: number;
}

export class LoadResponseEntity {
  @IsNumber()
  @ApiProperty({
    description: 'The id of load',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The min budget for load',
    example: 500,
  })
  minBudget: number;

  @ApiProperty({
    description: 'The max budget for load',
    example: 600,
  })
  maxBudget: number;

  @ApiProperty({
    description: 'isPrivate',
    example: false,
  })
  isPrivate: boolean;

  @ApiProperty({
    description: 'createdBy',
    example: 2,
  })
  createdBy: number;

  @ApiProperty({
    description: 'shipperId',
    example: 1,
  })
  shipperId: number;

  @ApiProperty({
    description: 'The status of sub load',
    example: 'draft',
  })
  status: string;

  @ApiProperty({
    description: 'createdAt',
    example: 1,
  })
  createdAt: string;

  @ApiProperty({
    description: 'updatedAt',
    example: 1,
  })
  updatedAt: string;

  @ApiProperty({
    description: 'deletedAt',
    example: 1,
  })
  deletedAt: string;

  @ApiProperty({
    description: 'The route start location details',
    example: {
      address: '123 Main St',
      lat: 31.509635,
      lng: 74.341322,
    },
  })
  routeStartLocation: LoadLocationResponseEntity;

  @ApiProperty({
    description: 'The route end location details',
    example: {
      address: '123 Main St',
      lat: 31.509635,
      lng: 74.341322,
    },
  })
  routeEndLocation: LoadLocationResponseEntity;

  @ApiProperty({
    type: [LoadDetailsResponseEntity],
    description: 'An array of sub loads to be created',
    example: [
      {
        id: 1,
        loadUid: 'Load_12345',
        title: 'Load 1',
        loadType: 'Briefly describe your load',
        weightUnit: Weight_Unit_Names.kg,
        weight: 50,
        dimension_unit: Dimension_Unit_Names.cm,
        dimensions: {
          length: 10,
          width: 10,
          height: 5,
        },
        vehicleType: Vehicle_Type_Names.DRY_VAN,
        pickupLocation: {
          address: '123 Main St',
          lat: 31.509635,
          lng: 74.341322,
        },
        pickupDateTime: '2024-12-17T12:00:00Z',
        destinationLocation: {
          address: '456 Other St',
          lat: 31.474495,
          lng: 74.402423,
        },
        arrivalDateTime: '2025-01-17T12:00:00Z',
        status: 'Posted',
        order: 1,
      },
      {
        id: 1,
        loadUid: 'Load_12346',
        title: 'Load 2',
        loadType: 'Another load description',
        weightUnit: Weight_Unit_Names.lb,
        weight: 100,
        dimension_unit: Dimension_Unit_Names.in,
        dimensions: {
          length: 20,
          width: 20,
          height: 10,
        },
        vehicleType: Vehicle_Type_Names.FLATBED_TRUCK,
        pickupLocation: {
          address: '789 Another St',
          lat: 30.12345,
          lng: 74.98765,
        },
        pickupDateTime: '2024-12-20T12:00:00Z',
        destinationLocation: {
          address: '101 Main St',
          lat: 31.12345,
          lng: 74.6789,
        },
        arrivalDateTime: '2025-01-20T12:00:00Z',
        status: 'Posted',
        order: 2,
      },
    ],
  })
  loadDetails: LoadDetailsResponseEntity[];

  @ApiProperty({
    type: String,
    nullable: true,
  })
  estimatedBudget?: number;
}
