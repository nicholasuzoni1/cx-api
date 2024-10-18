import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { RoleResponseEntity } from './role.response';

export class GetRoleResponseType extends JsonResponseClass<RoleResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to get role',
    type: RoleResponseEntity,
  })
  data: RoleResponseEntity;
}
