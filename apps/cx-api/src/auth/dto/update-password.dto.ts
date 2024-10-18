import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    description: 'The password of user',
    example: '123456S$',
  })
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    description: 'The password of user',
    example: '123456S$$',
  })
  newPassword: string;
}
