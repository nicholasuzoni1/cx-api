import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class SignupResponseEntity {}

export class SignupResponseType extends JsonResponseClass<SignupResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to signup',
    type: SignupResponseEntity,
  })
  data: SignupResponseEntity;
}
