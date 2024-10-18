import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class ResendForgotPasswordOtpResponseEntity {
  @ApiProperty({
    description: 'Unique hash',
  })
  hash: string;
}

export class ResendForgotPasswordOtpResponseType extends JsonResponseClass<ResendForgotPasswordOtpResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to forgot password',
    type: ResendForgotPasswordOtpResponseEntity,
  })
  data: ResendForgotPasswordOtpResponseEntity;
}
