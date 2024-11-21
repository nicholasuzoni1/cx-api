import { Dimension_Unit_List } from '@app/load-managment/dimension-types';
import { Vehicle_Type_NamedDescriptions } from '@app/load-managment/vehicle-types';
import { Weight_Unit_List } from '@app/load-managment/weight-types';
import { JsonResponseClass } from '@app/shared-lib';
import { VehicleTypeEntity } from 'apps/cx-api/entities/vehicle-type.entity';
import { VehicleTypeResponseEntity } from './vehicle-type.response';

import { ApiProperty } from '@nestjs/swagger';

export class DataforLoadPostingResponseEntity {
  @ApiProperty({
    type: [String],
    description: 'Dimension units',
    example: Dimension_Unit_List,
  })
  dimensionUnits: string[];

  @ApiProperty({
    type: [String],
    description: 'List of available weight units',
    example: Weight_Unit_List,
  })
  weightUnits: string[];

  @ApiProperty({
    description: 'Vehicle types with loads and rate',
    example: [
      {
        id: 1,
        name: 'Flatbed Truck',
        description: 'Open flat surface, used for large or heavy goods.',
        vehicleLoadTypes: [
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
      },
      {
        id: 2,
        name: 'Box Truck (Cargo Truck / Van)',
        description:
          'Enclosed box shape, used for general cargo and furniture.',
        vehicleLoadTypes: [
          {
            rate_per_mile: 51,
            load_type: {
              id: 4,
              name: 'General Freight',
              description: 'consumer goods, electronics',
            },
          },
        ],
      },
    ],
  })
  vehicleTypesWithLoad: VehicleTypeResponseEntity[];

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the vehicle type',
        },
        description: {
          type: 'string',
          description: 'A brief description of the vehicle type',
        },
      },
    },
    description: 'Vehicle types',
    example: Vehicle_Type_NamedDescriptions,
  })
  vehicleTypes: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
}

export class DataforLoadPostingResponseType extends JsonResponseClass<DataforLoadPostingResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to data for load posting',
    type: DataforLoadPostingResponseEntity,
  })
  data: DataforLoadPostingResponseEntity;
}
