import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SearchLoadFilters {
  pickupLocation: {
    lat: number;
    lng: number;
  };
  radius: number = 50;
}

export class SearchLoadsDto {
  @IsNumber()
  @ApiProperty({
    description: 'limit',
    example: 10,
  })
  limit: number = 10;

  @IsNumber()
  @ApiProperty({
    description: 'pageNumber',
    example: 1,
  })
  pageNumber: number = 1;

  filters: SearchLoadFilters;
}
