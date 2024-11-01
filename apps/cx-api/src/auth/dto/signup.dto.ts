import { Register_User_List } from '@app/permission-management/users';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, Matches } from 'class-validator';
export class SignupDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of user',
    example: 'dev',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'The mail of user',
    example: 'example@mail.com',
  })
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+<>?,.]).{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain at least one numeric and one special character',
  })
  @ApiProperty({
    description: 'The password of user',
    example: '123456S$',
  })
  password: string;

  @IsIn(Register_User_List)
  @IsNotEmpty()
  @ApiProperty({
    description: `The type of user: ${Register_User_List.toString()}`,
    example: 'shipper',
  })
  userType: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The company name',
    example: 'xyz company',
  })
  companyName: string;
}
