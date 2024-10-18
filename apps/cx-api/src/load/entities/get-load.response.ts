import { JsonResponseClass } from '@app/shared-lib';
import { LoadResponseEntity } from './load.response';
import { ApiProperty } from '@nestjs/swagger';

export class GetLoadResponseType extends JsonResponseClass<LoadResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to get load',
    type: LoadResponseEntity,
  })
  data: LoadResponseEntity;
}
