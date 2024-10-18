import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class DeleteRoleResponseType extends JsonResponseClass<object> {
  @ApiProperty({
    description: 'Data of the response specific to delete role',
    type: Object,
  })
  data: object;
}
