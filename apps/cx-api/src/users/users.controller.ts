import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserResponseType } from './entities/create-user.response';
import { UserTokenPayloadType } from '@app/permission-management';
import { getAssociationId } from '@app/permission-management/get-association';
import { responseWrapper } from '@app/shared-lib';
import { UpdateUserResponseType } from './entities/update-user.response';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUserResponseType } from './entities/list-user.response';
import { GetUserResponseType } from './entities/get-user.response';
import { DeleteUserResponseType } from './entities/delete-user.response';
import { VerifyCreatedUserDto } from './dto/verify-created-user.dto';
import { VerifyCreatedUserResponseType } from './entities/verify-created-user.response';
import { Module_Names } from '@app/permission-management/permission-module-keys';
import { AccountsModuleKeys } from '@app/permission-management/permission-module-keys/modules/accounts';
import { PermissionsDecorator } from '@app/shared-lib/decorators/permissions.decorator';
import { JwtAuthGuard } from '../guard/guards/jwt-auth.guard';
import { CommonPermissionGuard } from '../guard/guards/common-permission.guard';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, CommonPermissionGuard)
  @PermissionsDecorator({
    module: Module_Names.Accounts,
    key: AccountsModuleKeys.CREATE_ACCOUNT,
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: CreateUserResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async create(@Request() req, @Body() input: CreateUserDto) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.usersService.create(input, {
        createdBy: user.id,
        associatedTo: getAssociationId(user),
      });
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/verify')
  @ApiResponse({
    status: 201,
    description: 'User verified',
    type: VerifyCreatedUserResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async verify(@Request() req, @Body() input: VerifyCreatedUserDto) {
    try {
      const output = await this.usersService.verify(input);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Patch('/')
  @UseGuards(JwtAuthGuard, CommonPermissionGuard)
  @PermissionsDecorator({
    module: Module_Names.Accounts,
    key: AccountsModuleKeys.UPDATE_ACCOUNT,
  })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UpdateUserResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async update(@Request() req, @Body() input: UpdateUserDto) {
    try {
      const user = req.user as UserTokenPayloadType;
      const associatedTo = getAssociationId(user);
      const output = await this.usersService.update(input, {
        associatedTo: associatedTo,
      });
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/')
  @UseGuards(JwtAuthGuard, CommonPermissionGuard)
  @PermissionsDecorator({
    module: Module_Names.Accounts,
    key: AccountsModuleKeys.LIST_ACCOUNTS,
  })
  @ApiResponse({
    status: 200,
    description: 'Users received.',
    type: ListUserResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async list(@Request() req) {
    try {
      const user = req.user as UserTokenPayloadType;
      const associatedTo = getAssociationId(user);
      const output = await this.usersService.list(associatedTo);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, CommonPermissionGuard)
  @PermissionsDecorator({
    module: Module_Names.Accounts,
    key: AccountsModuleKeys.VIEW_ACCOUNT,
  })
  @ApiParam({ name: 'id', type: Number, description: 'id of user' })
  @ApiResponse({
    status: 200,
    description: 'Role received.',
    type: GetUserResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async get(@Request() req, @Param('id') id: number) {
    try {
      const user = req.user as UserTokenPayloadType;
      const associatedTo = getAssociationId(user);
      const output = await this.usersService.get(id, associatedTo);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, CommonPermissionGuard)
  @PermissionsDecorator({
    module: Module_Names.Accounts,
    key: AccountsModuleKeys.DELETE_ACCOUNT,
  })
  @ApiParam({ name: 'id', type: Number, description: 'id of role' })
  @ApiResponse({
    status: 200,
    description: 'User deleted.',
    type: DeleteUserResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async delete(@Request() req, @Param('id') id: number) {
    try {
      const user = req.user as UserTokenPayloadType;
      const associatedTo = getAssociationId(user);
      const output = await this.usersService.delete(id, associatedTo);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }
}
