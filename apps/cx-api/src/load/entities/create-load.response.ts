import { JsonResponseClass } from '@app/shared-lib';
import { LoadResponseEntity } from './load.response';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoadResponseType extends JsonResponseClass<LoadResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to create load',
    type: LoadResponseEntity,
  })
  data: LoadResponseEntity;
}
