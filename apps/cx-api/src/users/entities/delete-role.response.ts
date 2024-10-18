import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class DeleteUserResponseType extends JsonResponseClass<object> {
  @ApiProperty({
    description: 'Data of the response specific to delete user',
    type: Object,
  })
  data: object;
}
