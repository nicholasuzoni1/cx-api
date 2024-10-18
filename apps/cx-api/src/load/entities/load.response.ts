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

export class LoadResponseEntity {
  @IsNumber()
  @ApiProperty({
    description: 'The id of load',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The title of load',
    example: 'title',
  })
  title: string;
  @ApiProperty({
    description: 'The type of load',
    example: 'Briefly descripe your load',
  })
  loadType: string;

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
  dimension_unit: Dimension_Unit_Type;

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
  vehicleType: Vehicle_Type;

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
    description: 'asssociatedTo',
    example: 1,
  })
  asssociatedTo: number;

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
}
