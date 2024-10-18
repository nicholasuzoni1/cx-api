import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class VerifyResetPasswordOtpResponseEntity {
  @ApiProperty({
    description: 'Unique hash',
  })
  hash: string;
}

export class VerifyResetPasswordOtpResponseType extends JsonResponseClass<VerifyResetPasswordOtpResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to verify reset password otp',
    type: VerifyResetPasswordOtpResponseEntity,
  })
  data: VerifyResetPasswordOtpResponseEntity;
}
