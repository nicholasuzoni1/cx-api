import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'name',
    example: 'John',
  })
  name: string;

  @IsEmail()
  @IsString()
  @ApiProperty({
    description: 'email',
    example: 'subuser@mail.com',
  })
  email: string;

  @IsNumber()
  @ApiProperty({
    description: 'roleId',
    example: 1,
  })
  roleId: number;
}
