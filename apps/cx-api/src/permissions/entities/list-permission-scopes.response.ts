import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class ListPermissionScopesResponseType extends JsonResponseClass<
  string[]
> {
  @ApiProperty({
    description: 'Data of the response specific to list permission scopes',
    type: String,
    isArray: true,
  })
  data: string[];
}
