import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateLoadDto } from './create-load.dto';

export class UpdateLoadDto extends CreateLoadDto {
  @IsNumber()
  @ApiProperty({
    description: 'The id of load',
    example: 1,
  })
  id: number;
}
