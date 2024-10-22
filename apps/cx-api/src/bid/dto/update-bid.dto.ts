import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateBidDto {
  @IsNumber()
  @ApiProperty({
    description: 'The id of bid',
    example: 1,
  })
  id: number;

  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'The price of bid',
    example: 500,
  })
  price: number;
}
