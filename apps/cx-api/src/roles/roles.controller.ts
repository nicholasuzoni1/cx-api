import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserTokenPayloadType } from '@app/permission-management';
import { CreateRoleResponseType } from './entities/create-role.response';
import { responseWrapper } from '@app/shared-lib';
import { UpdateRoleResponseType } from './entities/update-role.response';
import { UpdateRoleDto } from './dto/update-role.dto';
import { getAssociationId } from '@app/permission-management/get-association';
import { ListRoleResponseType } from './entities/list-role.response';
import { GetRoleResponseType } from './entities/get-role.response';
import { DeleteRoleResponseType } from './entities/delete-role.response';
import { Module_Names } from '@app/permission-management/permission-module-keys';
import { RolesModuleKeys } from '@app/permission-management/permission-module-keys/modules/roles';
import { PermissionsDecorator } from '@app/shared-lib/decorators/permissions.decorator';
import { JwtAuthGuard } from '../guard/guards/jwt-auth.guard';
import { CommonPermissionGuard } from '../guard/guards/common-permission.guard';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, CommonPermissionGuard)
  @PermissionsDecorator({
    module: Module_Names.Roles,
    key: RolesModuleKeys.CREATE_ROLE,
  })
  @ApiResponse({
    status: 201,
    description: 'Role created',
    type: CreateRoleResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async create(@Request() req, @Body() input: CreateRoleDto) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.rolesService.create(input, {
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

  @Patch('/')
  @UseGuards(JwtAuthGuard, CommonPermissionGuard)
  @PermissionsDecorator({
    module: Module_Names.Roles,
    key: RolesModuleKeys.UPDATE_ROLE,
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated',
    type: UpdateRoleResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async update(@Request() req, @Body() input: UpdateRoleDto) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.rolesService.update(input, {
        associatedTo: getAssociationId(user),
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
    module: Module_Names.Roles,
    key: RolesModuleKeys.LIST_ROLES,
  })
  @ApiResponse({
    status: 200,
    description: 'Roles received.',
    type: ListRoleResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async list(@Request() req) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.rolesService.list(getAssociationId(user));
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
    module: Module_Names.Roles,
    key: RolesModuleKeys.VIEW_ROLE,
  })
  @ApiParam({ name: 'id', type: Number, description: 'id of role' })
  @ApiResponse({
    status: 200,
    description: 'Role received.',
    type: GetRoleResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async get(@Request() req, @Param('id') id: number) {
    try {
      const user = req.user as UserTokenPayloadType;
      const associatedTo = getAssociationId(user);
      const output = await this.rolesService.get(id, associatedTo);
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
    module: Module_Names.Roles,
    key: RolesModuleKeys.DELETE_ROLE,
  })
  @ApiParam({ name: 'id', type: Number, description: 'id of role' })
  @ApiResponse({
    status: 200,
    description: 'Role deleted.',
    type: DeleteRoleResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async delete(@Request() req, @Param('id') id: number) {
    try {
      const user = req.user as UserTokenPayloadType;
      const associatedTo = getAssociationId(user);
      const output = await this.rolesService.delete(id, associatedTo);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }
}
