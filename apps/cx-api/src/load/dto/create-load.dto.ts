import {
  Dimension_Unit_List,
  Dimension_Unit_Names,
  Dimension_Unit_Type,
} from '@app/load-managment/dimension-types';
import {
  Vehicle_Type,
  Vehicle_Type_List,
  Vehicle_Type_Names,
} from '@app/load-managment/vehicle-types';
import {
  Weight_Unit_List,
  Weight_Unit_Names,
  Weight_Unit_Type,
} from '@app/load-managment/weight-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  IsString,
  ValidateNested,
  IsDateString,
  IsIn,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { LoadStatus } from '@app/load-managment/enums/load-statuses';
import { VehicleTypeEntity } from 'apps/cx-api/entities/vehicle-type.entity';

class LoadDimensions {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'The length of the load', example: 10 })
  length: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'The width of the load', example: 10 })
  width: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'The height of the load', example: 5 })
  height: number;
}

export class LoadLocation {
  //@IsNotEmpty()
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The address of the location',
    example: '123 Main St',
  })
  address?: string;

  //@IsNotEmpty()
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The latitude of the location',
    example: 40.7128,
  })
  lat?: number;

  //@IsNotEmpty()
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The longitude of the location',
    example: -74.006,
  })
  lng?: number;
}

// Decorator to check if the date is in the past
export function IsNotPastDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isNotPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, _args: ValidationArguments) {
          if (!value) return true; // skip validation if value is not provided
          const now = new Date();
          return new Date(value) >= now;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultMessage(_args: ValidationArguments) {
          return `${property} must not be in the past.`;
        },
      },
    });
  };
}

// Decorator to check if arrival is after pickup
export function IsAfterDate(
  pickupProperty: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const pickupDate = (args.object as any)[pickupProperty];
          if (!value || !pickupDate) return true; // skip validation if any value is missing
          return new Date(value) > new Date(pickupDate);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultMessage(_args: ValidationArguments) {
          return `${propertyName} must be after ${pickupProperty}.`;
        },
      },
    });
  };
}

// Decorator to check if maxBudget is greater than or equal to minBudget
export function IsMaxBudgetGreaterThanMinBudget(
  minBudgetProperty: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isMaxBudgetGreaterThanMinBudget',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const minBudget = (args.object as any)[minBudgetProperty];
          if (value === undefined || minBudget === undefined) return true; // skip validation if any value is missing
          return value >= minBudget; // maxBudget must be greater than or equal to minBudget
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultMessage(_args: ValidationArguments) {
          return `Maximum budget must be greater than or equal to minimum budget.`;
        },
      },
    });
  };
}

export type LoadAdditionalData = {
  shipperId: number;
  createdBy?: number;
};

export class CreateLoadDetailsDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The UID for the load',
    example: 'job_12345',
  })
  loadUid: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of load',
    example: 'title',
  })
  title: string;

  @IsNotEmpty()
  @IsIn(Weight_Unit_List)
  @ApiProperty({
    description: 'The unit of load',
    example: Weight_Unit_Names.kg,
  })
  weightUnit: Weight_Unit_Type;

  @IsNumber()
  @ApiProperty({
    description: 'The weight of load',
    example: 50,
  })
  weight: number;

  @IsNotEmpty()
  @IsIn(Dimension_Unit_List)
  @ApiProperty({
    description: 'The dimesion unit for load',
    example: Dimension_Unit_Names.cm,
  })
  dimensionUnit: Dimension_Unit_Type;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoadDimensions)
  @ApiProperty({
    description: 'The dimensions of the load',
    example: {
      length: 10,
      width: 10,
      height: 5,
    },
  })
  dimensions: LoadDimensions;

  //@IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description: 'The id of vehicle type',
    example: 1,
  })
  vehicleTypeId?: number;

  //@IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description: 'The id of load type',
    example: 'Briefly descripe your load',
  })
  loadTypeId?: number;

  @IsOptional()
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Total milage for that stop-over.',
  })
  milage?: string;

  // @IsNotEmpty()
  @IsOptional()
  @ValidateNested()
  @Type(() => LoadLocation)
  @ApiProperty({
    description: 'The pickup location details',
    example: {
      address: '123 Main St',
      lat: 31.509635,
      lng: 74.341322,
    },
    nullable: true,
  })
  pickupLocation?: LoadLocation | null;

  // @IsNotEmpty()
  @IsOptional()
  @IsDateString()
  @IsNotPastDate('pickupDateTime', {
    message: 'Pickup date and time must not be in the past.',
  })
  @ApiProperty({
    description: 'The pickup date of the load',
    example: '2024-12-17T12:00:00Z',
  })
  pickupDateTime?: string | null;

  // @IsNotEmpty()
  @IsOptional()
  @ValidateNested()
  @Type(() => LoadLocation)
  @ApiProperty({
    description: 'The destination location details',
    example: {
      address: '123 Main St',
      lat: 31.474495,
      lng: 74.402423,
    },
    nullable: true,
  })
  destinationLocation?: LoadLocation | null;

  // @IsNotEmpty()
  @IsOptional()
  @IsDateString()
  @IsAfterDate('pickupDateTime', {
    message: 'Arrival date and time must be after pickup date and time.',
  })
  @ApiProperty({
    description: 'The arrival datetime of the load',
    example: '2025-01-17T12:00:00Z',
  })
  arrivalDateTime?: string | null;

  @IsOptional()
  @ApiProperty({
    description: 'The status of sub load',
    example: 'draft',
  })
  @IsEnum(LoadStatus, {
    message: 'Status must be one of: active, in_transit, completed',
  })
  status?: LoadStatus;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Order of sub load',
    example: '1',
  })
  order?: number;
}

export class CreateLoadDto {
  shipperId?: number;

  @IsNumber()
  @ApiProperty({
    description: 'The min budget for load',
    example: 500,
  })
  minBudget: number;

  @IsNumber()
  @IsMaxBudgetGreaterThanMinBudget('minBudget', {
    message: 'Maximum budget must be greater than or equal to minimum budget.',
  })
  @ApiProperty({
    description: 'The max budget for load',
    example: 600,
  })
  maxBudget: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Is this load is private',
    example: false,
  })
  isPrivate?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Is this load is private',
    example: false,
  })
  isContractMade?: boolean;

  @IsOptional()
  @ApiProperty({
    description: 'The status of load',
    example: 'draft',
  })
  @IsEnum(LoadStatus, {
    message: 'Status must be one of: active, in_transit, completed',
  })
  status?: LoadStatus;

  @IsOptional()
  @ApiProperty({
    description: 'Load details created by',
    example: '1',
  })
  createdBy?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LoadLocation)
  @ApiProperty({
    description: 'The route pickup location details',
    example: {
      address: '123 Main St',
      lat: 31.474495,
      lng: 74.402423,
    },
    nullable: true,
  })
  routeStartLocation?: LoadLocation | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => LoadLocation)
  @ApiProperty({
    description: 'The route pickup location details',
    example: {
      address: '123 Main St',
      lat: 31.474495,
      lng: 74.402423,
    },
    nullable: true,
  })
  routeEndLocation?: LoadLocation | null;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateLoadDetailsDto)
  @ApiProperty({
    type: [CreateLoadDetailsDto],
    description: 'An array of sub loads to be created',
    example: [
      {
        title: 'Load 1',
        loadUid: 'Load_1',
        loadTypeId: 1,
        vehicleTypeId: 1,
        milage: '20',
        weightUnit: Weight_Unit_Names.kg,
        weight: 50,
        dimensionUnit: Dimension_Unit_Names.cm,
        dimensions: {
          length: 10,
          width: 10,
          height: 5,
        },
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
        status: 'draft',
        order: 1,
      },
      {
        title: 'Load 2',
        loadUid: 'Load_2',
        vehicleTypeId: 1,
        loadTypeId: 1,
        milage: '25',
        weightUnit: Weight_Unit_Names.lb,
        weight: 100,
        dimensionUnit: Dimension_Unit_Names.in,
        dimensions: {
          length: 20,
          width: 20,
          height: 10,
        },
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
        status: 'draft',
        order: 2,
      },
    ],
  })
  loadDetails: CreateLoadDetailsDto[];
}
