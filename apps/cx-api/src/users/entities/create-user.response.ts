import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { UserResponseEntity } from './user.response';

export class CreateUserResponseType extends JsonResponseClass<UserResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to create user',
    type: UserResponseEntity,
  })
  data: UserResponseEntity;
}
