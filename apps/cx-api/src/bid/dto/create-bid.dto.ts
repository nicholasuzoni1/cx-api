import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export type BidAdditionalData = {
  carrierId: number;
  createdBy?: number;
};

export class CreateBidDto {
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'The price of bid',
    example: 500,
  })
  price: number;

  @IsNumber()
  @ApiProperty({
    description: 'The id of load',
    example: 1,
  })
  loadId: number;
}
