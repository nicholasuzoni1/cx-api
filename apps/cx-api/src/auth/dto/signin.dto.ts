import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @ApiProperty({
    description: 'The mail of user',
    example: 'example@mail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of user',
    example: '123456S$',
  })
  password: string;
}
