import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class ResetPasswordResponseEntity {}

export class ResetPasswordResponseType extends JsonResponseClass<ResetPasswordResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to reset password',
    type: ResetPasswordResponseEntity,
  })
  data: ResetPasswordResponseEntity;
}
