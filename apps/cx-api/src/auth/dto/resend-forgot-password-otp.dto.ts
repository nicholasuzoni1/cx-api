import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResendForgotPasswordOtpDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique hash',
    example: 'dfafdsfja;dkfjslfjslkjfklajsdfklsj',
  })
  hash: string;
}
