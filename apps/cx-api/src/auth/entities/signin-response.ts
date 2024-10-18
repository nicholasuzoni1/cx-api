import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { UserResponseEntity } from './user-response';
import { PermissionResponseEntity } from '../../permissions/entities/permission.response';

export class SigninResponseEntity {
  @ApiProperty({
    description: 'Access Token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User',
  })
  user: UserResponseEntity;

  @ApiProperty({
    description: 'Permissions',
    type: PermissionResponseEntity,
    isArray: true,
  })
  permissions: PermissionResponseEntity[];

  @ApiProperty({
    description: 'Scope',
  })
  scope: string;
}

export class SigninResponseType extends JsonResponseClass<SigninResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to signin',
    type: SigninResponseEntity,
  })
  data: SigninResponseEntity;
}
