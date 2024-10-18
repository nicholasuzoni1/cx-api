import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { PermissionResponseEntity } from './permission.response';

export class ListPermissionResponseType extends JsonResponseClass<
  PermissionResponseEntity[]
> {
  @ApiProperty({
    description: 'Data of the response specific to list permission',
    type: PermissionResponseEntity,
    isArray: true,
  })
  data: PermissionResponseEntity[];
}
