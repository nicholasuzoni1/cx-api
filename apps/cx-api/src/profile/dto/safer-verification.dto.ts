import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SaferVerifDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Company Name',
    example: '12345',
  })
  dotNumber: string;
}
