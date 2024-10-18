import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { RoleResponseEntity } from './role.response';

export class CreateRoleResponseType extends JsonResponseClass<RoleResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to create role',
    type: RoleResponseEntity,
  })
  data: RoleResponseEntity;
}
