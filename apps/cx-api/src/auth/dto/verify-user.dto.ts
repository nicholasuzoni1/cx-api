import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The unique hash',
    example: 'example@mail.com',
  })
  hash: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Code',
    example: '123456',
  })
  code: string;
}
