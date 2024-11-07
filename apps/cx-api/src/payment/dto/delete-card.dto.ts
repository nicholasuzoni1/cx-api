import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteCardDto {
  @IsString()
  @ApiProperty({
    description: 'Payment method id',
    example: 'pm_1QH****',
  })
  paymentMethodId: string;
}
