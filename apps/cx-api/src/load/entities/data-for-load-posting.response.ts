import { Dimension_Unit_List } from '@app/load-managment/dimension-types';
import { Vehicle_Type_NamedDescriptions } from '@app/load-managment/vehicle-types';
import { Weight_Unit_List } from '@app/load-managment/weight-types';
import { JsonResponseClass } from '@app/shared-lib';

import { ApiProperty } from '@nestjs/swagger';

export class DataforLoadPostingResponseEntity {
  @ApiProperty({
    type: [String],
    description: 'Dimension units',
    example: Dimension_Unit_List,
  })
  dimensionUnits: string[];

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

  @ApiProperty({
    type: [String],
    description: 'List of available weight units',
    example: Weight_Unit_List,
  })
  weightUnits: string[];
}

export class DataforLoadPostingResponseType extends JsonResponseClass<DataforLoadPostingResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to data for load posting',
    type: DataforLoadPostingResponseEntity,
  })
  data: DataforLoadPostingResponseEntity;
}
