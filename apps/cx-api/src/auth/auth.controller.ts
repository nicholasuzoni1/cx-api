import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { responseWrapper } from '@app/shared-lib/json-response';
import { SignupResponseType } from './entities/signup-response';
import { SigninDto } from './dto/signin.dto';
import { SigninResponseType } from './entities/signin-response';
import { VerifyUserDto } from './dto/verify-user.dto';
import { VerifyUserResponseType } from './entities/verify-user-response';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordResponseType } from './entities/forgot-password-response';
import { ResetPasswordResponseType } from './entities/reset-password-response';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendForgotPasswordOtpResponseType } from './entities/resend-forgot-password-otp-response';
import { ResendForgotPasswordOtpDto } from './dto/resend-forgot-password-otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePasswordResponseType } from './entities/update-password-response';
import { UserTokenPayloadType } from '@app/permission-management';
import { VerifyResetPasswordOtpDto } from './dto/verify-reset-password-otp.dto';
import { VerifyResetPasswordOtpResponseType } from './entities/verify-reset-password-otp-response';
import { JwtAuthGuard } from '../guard/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiResponse({
    status: 201,
    description: 'Signup Successful',
    type: SignupResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async signup(@Body() input: SignupDto) {
    try {
      const output = await this.authService.signup(input);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/verify-user')
  @ApiResponse({
    status: 201,
    description: 'User verified successfully.',
    type: VerifyUserResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async verifyUser(@Body() input: VerifyUserDto) {
    try {
      const output = await this.authService.verifyUser(input);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/signin')
  @ApiResponse({
    status: 201,
    description: 'Signin Successful',
    type: SigninResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async signin(@Body() input: SigninDto) {
    try {
      const output = await this.authService.signin(input);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/forgot-password')
  @ApiResponse({
    status: 201,
    description: 'Reset code sent successfully.',
    type: ForgotPasswordResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async forgotPassword(@Body() input: ForgotPasswordDto) {
    try {
      const output = await this.authService.forgotPassword(input);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/verify-reset-password-otp')
  @ApiResponse({
    status: 201,
    description: 'Reset password otp verified successfully.',
    type: VerifyResetPasswordOtpResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async verifyResetPasswordOtp(@Body() input: VerifyResetPasswordOtpDto) {
    try {
      const output = await this.authService.verifyResetPasswordOtp(input);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/reset-password')
  @ApiResponse({
    status: 201,
    description: 'Password reset successfully.',
    type: ResetPasswordResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async resetPassword(@Body() input: ResetPasswordDto) {
    try {
      const output = await this.authService.resetPassword(input);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/resend-forgot-password-otp')
  @ApiResponse({
    status: 201,
    description: 'Reset code sent sucessfully.',
    type: ResendForgotPasswordOtpResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async resendForgotPasswordOtp(@Body() input: ResendForgotPasswordOtpDto) {
    try {
      const output = await this.authService.resendForgotPasswordOtp(input);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/update-password')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Password updated successfully.',
    type: UpdatePasswordResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async updatePassword(@Request() req, @Body() input: UpdatePasswordDto) {
    try {
      const user = req.user as UserTokenPayloadType;

      const authHeader = req.headers.authorization;

      const token = authHeader.split(' ')[1];

      const output = await this.authService.updatePassword(input, {
        userId: user.id,
        session: token,
      });
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }
}
