import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsNumber,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of role',
    example: 'Manager',
  })
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @ApiProperty({
    description: 'Permission ids',
    example: [1, 2],
  })
  permissions: number[];
}
