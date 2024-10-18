import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

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
  @MinLength(8)
  @ApiProperty({
    description: 'password',
    example: '123456S$',
  })
  password: string;
}
