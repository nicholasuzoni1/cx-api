import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';

export class UpdateRoleDto {
  @IsNumber()
  @ApiProperty({
    description: 'The id of role',
    example: '1',
  })
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The name of role',
    example: 'Manager',
  })
  name?: string;

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
