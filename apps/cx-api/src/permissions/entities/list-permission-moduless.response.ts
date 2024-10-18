import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class ListPermissionModulesResponseType extends JsonResponseClass<
  string[]
> {
  @ApiProperty({
    description: 'Data of the response specific to list permission modules',
    type: String,
    isArray: true,
  })
  data: string[];
}
