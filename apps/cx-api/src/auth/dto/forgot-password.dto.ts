import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({
    description: 'The mail of user',
    example: 'example@mail.com',
  })
  email: string;
}
