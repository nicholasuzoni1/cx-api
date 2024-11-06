import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseEntity {
  @ApiProperty({
    description: 'Id of profile',
  })
  id: number;

  @ApiProperty({
    description: 'Name of company',
  })
  name: string;

  @ApiProperty({
    description: 'Name of company',
  })
  companyName: string;

  @ApiProperty({
    description: 'Contact number of company',
  })
  contactNumber: string;

  @ApiProperty({
    description: 'Fax number of company',
  })
  faxNumber: string;

  @ApiProperty({
    description: 'Licence number of company',
  })
  licenseNumber: string;

  @ApiProperty({
    description: 'Tax number of company',
  })
  taxNumber: string;

  @ApiProperty({
    description: 'Dot number of company',
  })
  dotNumber: string;

  @ApiProperty({
    description: 'Safer verification of company',
  })
  saferVerified: boolean;

  @ApiProperty({
    description: 'createdAt',
  })
  createdAt: string;

  @ApiProperty({
    description: 'updatedAt',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'deletedAt',
  })
  deletedAt: string;
}
