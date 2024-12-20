import { Register_User_List } from '@app/permission-management/users';
import { IsValidContactNo } from '@app/shared-lib/decorators/contact-no-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';
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
  @MinLength(8)
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
  @IsValidContactNo()
  @ApiProperty({
    description: 'The contactNo of user',
    example: '+923401001000',
  })
  contactNo: string;
}
