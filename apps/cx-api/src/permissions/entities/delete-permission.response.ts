import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class DeletePermissionResponseType extends JsonResponseClass<object> {
  @ApiProperty({
    description: 'Data of the response specific to delete permission',
    type: Object,
  })
  data: object;
}
