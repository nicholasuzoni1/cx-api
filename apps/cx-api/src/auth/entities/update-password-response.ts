import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class UpdatePasswordResponseEntity {}

export class UpdatePasswordResponseType extends JsonResponseClass<UpdatePasswordResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to update password',
    type: UpdatePasswordResponseEntity,
  })
  data: UpdatePasswordResponseEntity;
}
