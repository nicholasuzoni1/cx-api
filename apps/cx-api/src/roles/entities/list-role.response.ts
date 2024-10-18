import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { RoleResponseEntity } from './role.response';

export class ListRoleResponseType extends JsonResponseClass<
  RoleResponseEntity[]
> {
  @ApiProperty({
    description: 'Data of the response specific to list Role',
    type: RoleResponseEntity,
    isArray: true,
  })
  data: RoleResponseEntity[];
}
