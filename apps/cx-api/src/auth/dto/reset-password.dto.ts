import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique hash',
    example: 'dfafdsfja;dkfjslfjslkjfklajsdfklsj',
  })
  hash: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    description: 'The password of user',
    example: '123456S$',
  })
  password: string;
}
