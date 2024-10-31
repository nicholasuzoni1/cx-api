import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  @ApiProperty({
    description: 'id',
    example: 2,
  })
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'name',
    example: 'john',
  })
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'roleId',
    example: 1,
  })
  roleId?: number;
}
