import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { UserResponseEntity } from './user.response';

export class ListUserResponseType extends JsonResponseClass<
  UserResponseEntity[]
> {
  @ApiProperty({
    description: 'Data of the response specific to list user',
    type: UserResponseEntity,
    isArray: true,
  })
  data: UserResponseEntity[];
}
