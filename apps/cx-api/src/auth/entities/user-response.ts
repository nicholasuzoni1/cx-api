import Stripe from 'stripe';
import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

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
    description: 'Creator id of user',
  })
  subscription?: Stripe.Subscription;
}

export class UserResponseType extends JsonResponseClass<UserResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to user',
    type: UserResponseEntity,
  })
  data: UserResponseEntity;
}
