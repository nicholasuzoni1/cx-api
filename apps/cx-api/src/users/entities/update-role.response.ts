import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { UserResponseEntity } from './user.response';

export class UpdateUserResponseType extends JsonResponseClass<UserResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to update user',
    type: UserResponseEntity,
  })
  data: UserResponseEntity;
}
