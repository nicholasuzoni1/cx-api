import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseEntity {
  @ApiProperty({
    description: 'id',
  })
  id: number;

  @ApiProperty({
    description: 'name',
  })
  name: string;

  @ApiProperty({
    description: 'Unique key',
  })
  key: string;

  @ApiProperty({
    description: 'module',
  })
  module: string;

  @ApiProperty({
    description: 'scope',
  })
  scope: string;

  @ApiProperty({
    description: 'createdBy',
  })
  createdBy: number;

  @ApiProperty({
    description: 'createdAt',
  })
  createdAt: string;

  @ApiProperty({
    description: 'updatedAt',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'deletedAt',
  })
  deletedAt: string;
}
