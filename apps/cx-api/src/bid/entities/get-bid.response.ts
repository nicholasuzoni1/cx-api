import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { BidResponseEntity } from './bid.entity.response';

export class GetBidResponseType extends JsonResponseClass<BidResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to get Bid',
    type: BidResponseEntity,
  })
  data: BidResponseEntity;
}
