import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLoadDto } from './create-load.dto';
import { IsNumber } from 'class-validator';

export class UpdateLoadDto extends PartialType(CreateLoadDto) {
  @IsNumber()
  @ApiProperty({
    description: 'The id of load',
    example: 1,
  })
  id: number;
}
