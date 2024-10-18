import { JsonResponseClass } from '@app/shared-lib';
import { LoadResponseEntity } from './load.response';
import { ApiProperty } from '@nestjs/swagger';

export class ListLoadResponseType extends JsonResponseClass<
  LoadResponseEntity[]
> {
  @ApiProperty({
    description: 'Data of the response specific to list load',
    type: LoadResponseEntity,
    isArray: true,
  })
  data: LoadResponseEntity[];
}
