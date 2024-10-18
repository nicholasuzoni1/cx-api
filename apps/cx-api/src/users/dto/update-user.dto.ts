import { IsValidContactNo } from '@app/shared-lib/decorators/contact-no-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  @IsValidContactNo()
  @ApiProperty({
    description: 'contactNo',
    example: '+923401001000',
  })
  contactNo?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'roleId',
    example: 1,
  })
  roleId?: number;
}
