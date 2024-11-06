import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';
import { SupportedLangs } from '@app/lang-lib/lang-translator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'name',
    example: 'John',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @IsIn(SupportedLangs)
  @ApiProperty({
    description: 'language',
    example: 'en',
  })
  language?: string;
}
