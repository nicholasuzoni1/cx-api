import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { responseWrapper } from '@app/shared-lib';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreatePermissionResponseType } from './entities/create-permission.response';
import { GetPermissionResponseType } from './entities/get-permission.response';
import { ListPermissionResponseType } from './entities/list-permission.response';
import { DeletePermissionResponseType } from './entities/delete-permission.response';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdatePermissionResponseType } from './entities/update-permission.response';
import { ListPermissionModuleKeysResponseType } from './entities/list-permission-module-keys.response';
import { ListPermissionModulesResponseType } from './entities/list-permission-moduless.response';
import { ListPermissionScopesResponseType } from './entities/list-permission-scopes.response';
import { UserTokenPayloadType } from '@app/permission-management';
import { Module_Names } from '@app/permission-management/permission-module-keys';
import { PermissionsModuleKeys } from '@app/permission-management/permission-module-keys/modules/permissions';
import { PermissionsDecorator } from '@app/shared-lib/decorators/permissions.decorator';
import { JwtAuthGuard } from '../guard/guards/jwt-auth.guard';
import { AdminGuard } from '../guard/guards/admin.guard';
import { CommonPermissionGuard } from '../guard/guards/common-permission.guard';

@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @PermissionsDecorator({
    module: Module_Names.Permssions,
    key: PermissionsModuleKeys.CREATE_PERMISSION,
  })
  @ApiResponse({
    status: 201,
    description: 'Permission created',
    type: CreatePermissionResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async create(@Request() req, @Body() input: CreatePermissionDto) {
    try {
      const output = await this.permissionService.create(input, {
        createdBy: req.user.id,
      });
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put('/')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @PermissionsDecorator({
    module: Module_Names.Permssions,
    key: PermissionsModuleKeys.UPDATE_PERMISSION,
  })
  @ApiResponse({
    status: 200,
    description: 'Permission updated',
    type: UpdatePermissionResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async update(@Request() req, @Body() input: UpdatePermissionDto) {
    try {
      const output = await this.permissionService.update(input);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @PermissionsDecorator({
    module: Module_Names.Permssions,
    key: PermissionsModuleKeys.LIST_PERMISSIONS,
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions received.',
    type: ListPermissionResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async list() {
    try {
      const output = await this.permissionService.list();
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/modules-keys')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @PermissionsDecorator({
    module: Module_Names.Permssions,
    key: PermissionsModuleKeys.LIST_PERMISSION_MODULE_KEYS,
  })
  @ApiResponse({
    status: 200,
    description: 'Permission module keys received.',
    type: ListPermissionModuleKeysResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async listModuleKeys() {
    try {
      const output = await this.permissionService.listModuleKeys();
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/modules') // ':id' defines a route parameter
  @UseGuards(JwtAuthGuard, AdminGuard)
  @PermissionsDecorator({
    module: Module_Names.Permssions,
    key: PermissionsModuleKeys.LIST_PERMISSION_MODULES,
  })
  @ApiResponse({
    status: 200,
    description: 'Permission modules received.',
    type: ListPermissionModulesResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async listModules() {
    try {
      const output = await this.permissionService.listModules();
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/scopes') // ':id' defines a route parameter
  @UseGuards(JwtAuthGuard, AdminGuard)
  @PermissionsDecorator({
    module: Module_Names.Permssions,
    key: PermissionsModuleKeys.LIST_PERMISSION_SCOPES,
  })
  @ApiResponse({
    status: 200,
    description: 'Permission scopes received.',
    type: ListPermissionScopesResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async listScopes() {
    try {
      const output = await this.permissionService.listScopes();
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/scoped-permisssions')
  @UseGuards(JwtAuthGuard, CommonPermissionGuard)
  @PermissionsDecorator({
    module: Module_Names.Permssions,
    key: PermissionsModuleKeys.LIST_SCOPED_PERMISSIONS,
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions received.',
    type: ListPermissionResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async listWithScope(@Request() req) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.permissionService.list(user.scope);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':id') // ':id' defines a route parameter
  @UseGuards(JwtAuthGuard, CommonPermissionGuard)
  @PermissionsDecorator({
    module: Module_Names.Permssions,
    key: PermissionsModuleKeys.VIEW_PERMISSION,
  })
  @ApiParam({ name: 'id', type: Number, description: 'id of permission' })
  @ApiResponse({
    status: 200,
    description: 'Permission received.',
    type: GetPermissionResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async get(@Param('id') id: number) {
    try {
      const output = await this.permissionService.get(id);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id') // ':id' defines a route parameter
  @UseGuards(JwtAuthGuard, AdminGuard)
  @PermissionsDecorator({
    module: Module_Names.Permssions,
    key: PermissionsModuleKeys.DELETE_PERMISSION,
  })
  @ApiParam({ name: 'id', type: Number, description: 'id of permission' })
  @ApiResponse({
    status: 200,
    description: 'Permission deleted.',
    type: DeletePermissionResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async delete(@Param('id') id: number) {
    try {
      const output = await this.permissionService.delete(id);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }
}
