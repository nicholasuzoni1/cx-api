import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyCreatedUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'code',
    example: '123456',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'associatedTo',
    example: 'dfafadfsfdsfsdfd',
  })
  hash: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+<>?,.]).{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain at least one numeric and one special character',
  })
  @ApiProperty({
    description: 'password',
    example: '123456S$',
  })
  password: string;
}
