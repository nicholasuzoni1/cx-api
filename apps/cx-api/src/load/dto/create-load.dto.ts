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
} from 'class-validator';

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

class LoadLocation {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The address of the location',
    example: '123 Main St',
  })
  address: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The latitude of the location',
    example: 40.7128,
  })
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The longitude of the location',
    example: -74.006,
  })
  lng: number;
}

export class CreateLoadDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of load',
    example: 'title',
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The type of load',
    example: 'Briefly descripe your load',
  })
  loadType: string;

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
  dimension_unit: Dimension_Unit_Type;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoadDimensions) // Needed for nested validation
  @ApiProperty({
    description: 'The dimensions of the load',
    example: {
      length: 10,
      width: 10,
      height: 5,
    },
  })
  dimensions: LoadDimensions;

  @IsNotEmpty()
  @IsIn(Vehicle_Type_List)
  @ApiProperty({
    description: 'The vehicle tyoe',
    example: Vehicle_Type_Names.dry_van,
  })
  vehicleType: Vehicle_Type;

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

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoadLocation) // Needed for nested validation
  @ApiProperty({
    description: 'The pickup location details',
    example: {
      address: '123 Main St',
      lat: 31.509635,
      lng: 74.341322,
    },
  })
  pickupLocation: LoadLocation;

  @IsNotEmpty()
  @IsDateString()
  @IsNotPastDate('pickupDateTime', {
    message: 'Pickup date and time must not be in the past.',
  })
  @ApiProperty({
    description: 'The pickup date of the load',
    example: '2024-12-17T12:00:00Z',
  })
  pickupDateTime: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoadLocation) // Needed for nested validation
  @ApiProperty({
    description: 'The destination location details',
    example: {
      address: '123 Main St',
      lat: 31.474495,
      lng: 74.402423,
    },
  })
  destinationLocation: LoadLocation;

  @IsNotEmpty()
  @IsDateString()
  @IsAfterDate('pickupDateTime', {
    message: 'Arrival date and time must be after pickup date and time.',
  })
  @ApiProperty({
    description: 'The arrival datetime of the load',
    example: '2025-01-17T12:00:00Z',
  })
  arrivalDateTime: string;
}
