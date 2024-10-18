import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyResetPasswordOtpDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique hash',
    example: 'dfafdsfja;dkfjslfjslkjfklajsdfklsj',
  })
  hash: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of user',
    example: '123456',
  })
  code: string;
}
