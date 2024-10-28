import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';

export class DeleteBidResponseType extends JsonResponseClass<object> {
  @ApiProperty({
    description: 'Data of the response specific to delete Bid',
    type: Object,
  })
  data: object;
}
