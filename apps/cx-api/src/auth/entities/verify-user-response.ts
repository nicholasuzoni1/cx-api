import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class VerifyUserResponseEntity {}

export class VerifyUserResponseType extends JsonResponseClass<VerifyUserResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to verify user',
    type: VerifyUserResponseEntity,
  })
  data: VerifyUserResponseEntity;
}
