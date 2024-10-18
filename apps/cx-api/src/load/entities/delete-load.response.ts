import { JsonResponseClass } from '@app/shared-lib';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteLoadResponseType extends JsonResponseClass<object> {
  @ApiProperty({
    description: 'Data of the response specific to delete load',
    type: {},
  })
  data: object;
}
