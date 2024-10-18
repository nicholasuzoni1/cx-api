export class Role {}
import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseEntity {
  @ApiProperty({
    description: 'id',
  })
  id: number;

  @ApiProperty({
    description: 'name',
  })
  name: string;

  @ApiProperty({
    description: 'permissions',
    type: Number,
    isArray: true,
  })
  permissions: number[];

  @ApiProperty({
    description: 'createdBy',
  })
  createdBy: number;

  @ApiProperty({
    description: 'associatedTo',
  })
  associatedTo: number;

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
