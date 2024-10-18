import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { PermissionResponseEntity } from './permission.response';

export class GetPermissionResponseType extends JsonResponseClass<PermissionResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to create permission',
    type: PermissionResponseEntity,
  })
  data: PermissionResponseEntity;
}
