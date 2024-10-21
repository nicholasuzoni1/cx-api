import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBidDto } from './create-bid.dto';
import { IsNumber } from 'class-validator';

export class UpdateBidDto extends PartialType(CreateBidDto) {
  @IsNumber()
  @ApiProperty({
    description: 'The id of bid',
    example: 1,
  })
  id: number;
}
