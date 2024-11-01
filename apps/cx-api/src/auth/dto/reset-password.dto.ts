import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique hash',
    example: 'dfafdsfja;dkfjslfjslkjfklajsdfklsj',
  })
  hash: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+<>?,.]).{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain at least one numeric and one special character',
  })
  @ApiProperty({
    description: 'The password of user',
    example: '123456S$',
  })
  password: string;
}
