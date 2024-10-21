import { ApiProperty } from '@nestjs/swagger';

export class BidResponseEntity {
  @ApiProperty({
    description: 'The id of bid',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The price of bid',
    example: 500,
  })
  price: number;

  @ApiProperty({
    description: 'The id of carrier',
    example: 1,
  })
  carrierId: number;

  @ApiProperty({
    description: 'createdBy',
  })
  createdBy: number;

  @ApiProperty({
    description: 'createdAt',
  })
  createdAt: string;

  @ApiProperty({
    description: 'updatedAt',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'deletedAt',
  })
  deletedAt: string;
}
