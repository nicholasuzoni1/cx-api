import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Company Name',
    example: 'Best Company',
  })
  companyName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Company contact number',
    example: '123456789',
  })
  contactNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Company fax number',
    example: '123456789',
  })
  faxNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Company license number',
    example: '123456789',
  })
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Company tax number',
    example: '123456789',
  })
  taxNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Company dot number',
    example: '123456789',
  })
  dotNumber?: string;
}
