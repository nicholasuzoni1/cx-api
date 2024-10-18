import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class ForgotPasswordResponseEntity {
  @ApiProperty({
    description: 'Unique hash',
  })
  hash: string;
}

export class ForgotPasswordResponseType extends JsonResponseClass<ForgotPasswordResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to forgot password',
    type: ForgotPasswordResponseEntity,
  })
  data: ForgotPasswordResponseEntity;
}
