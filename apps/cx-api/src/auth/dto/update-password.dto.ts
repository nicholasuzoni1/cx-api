import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of user',
    example: '123456S$',
  })
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+<>?,.]).{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain at least one numeric and one special character',
  })
  @ApiProperty({
    description: 'The password of user',
    example: '123456S$$',
  })
  newPassword: string;
}
