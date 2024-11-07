import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  UseGuards,
  Request,
  Body,
  Patch,
  Get,
  Post,
} from '@nestjs/common';

import { responseWrapper } from '@app/shared-lib';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../guard/guards/jwt-auth.guard';
import { UserTokenPayloadType } from '@app/permission-management';
import { GetProfileResponseType } from './entities/get-profile.response';
import { UpdateProfileResponseType } from './entities/update-profile.response';

import { SaferVerifDto } from './dto/safer-verification.dto';

@ApiBearerAuth()
@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch('/')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Profile updated',
    type: UpdateProfileResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async update(@Request() req, @Body() input: UpdateProfileDto) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.profileService.update(input, user?.id);

      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Profile fetch',
    type: GetProfileResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async get(@Request() req) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.profileService.get(user?.id);

      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/dot-number-verification')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Profile fetch',
    type: GetProfileResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async saferVerification(@Request() req, @Body() input: SaferVerifDto) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.profileService.saferVerification(
        input,
        user?.id,
      );

      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }
}
