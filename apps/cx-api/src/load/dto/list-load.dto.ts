import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ListLoadDto {
  @IsNumber()
  @ApiProperty({
    description: 'The id of load',
    example: 1,
  })
  id: number;
}
