export class Role {}
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseEntity {
  @ApiProperty({
    description: 'Id of user',
  })
  id: number;

  @ApiProperty({
    description: 'Name of user',
  })
  name: string;

  @ApiProperty({
    description: 'Email of user',
  })
  email: string;

  @ApiProperty({
    description: 'User type of user',
  })
  userType: string;

  @ApiProperty({
    description: 'Role id of user',
  })
  roleId?: number;

  @ApiProperty({
    description: 'Creator id',
  })
  associatedTo?: number;

  @ApiProperty({
    description: 'Verification status of user',
  })
  isVerified?: boolean | undefined;

  @ApiProperty({
    description: 'Creator id of user',
  })
  createdBy?: number;

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
