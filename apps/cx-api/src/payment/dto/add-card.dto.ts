import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddCardDto {
  @IsString()
  @ApiProperty({
    description: 'Customer Id',
    example: 'cus_R9x****',
  })
  customerId: string;

  @IsString()
  @ApiProperty({
    description: 'Payment method id',
    example: 'pm_1QH****',
  })
  paymentMethodId: string;
}
