import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class VerifyCreatedUserResponseType extends JsonResponseClass<object> {
  @ApiProperty({
    description: 'Data of the response specific to verify created user',
    type: Object,
  })
  data: object;
}
