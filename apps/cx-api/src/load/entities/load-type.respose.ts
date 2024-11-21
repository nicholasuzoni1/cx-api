import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LoadTypeResponseEntity {
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'The id of load type',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'The name of load type',
    example: 'Load type name',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The description of load type',
    example: 'Vehicly type name',
  })
  description: string;

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

export class VehicleLoadTypesResponseEntity {
  @ApiProperty({
    type: Number,
    description: 'Rate per mile.',
    example: 24,
  })
  ratePerMile: number;

  @ApiProperty({
    type: LoadTypeResponseEntity,
    description: 'Load Details',
    example: {
      id: 1,
      name: 'Heavy Machinery',
      description: 'construction equipment, industrial tools',
    },
  })
  loadType: LoadTypeResponseEntity;
}
