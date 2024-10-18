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
import { LoadService } from './load.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShipperGuard } from '../guard/guards/shipper.guard';
import { JwtAuthGuard } from '../guard/guards/jwt-auth.guard';
import { PermissionsDecorator } from '@app/shared-lib/decorators/permissions.decorator';
import { Module_Names } from '@app/permission-management/permission-module-keys';
import { LoadsModuleKeys } from '@app/permission-management/permission-module-keys/modules/loads';
import { responseWrapper } from '@app/shared-lib';
import { CreateLoadResponseType } from './entities/create-load.response';
import { ListLoadResponseType } from './entities/list-load.response';
import { GetLoadResponseType } from './entities/get-load.response';
import { UpdateLoadResponseType } from './entities/update-load.response';
import { DeleteLoadResponseType } from './entities/delete-load.response';
import { UserTokenPayloadType } from '@app/permission-management';
import { CommonPermissionGuard } from '../guard/guards/common-permission.guard';
import { getAssociationId } from '@app/permission-management/get-association';
@ApiBearerAuth()
@ApiTags('Loads')
@Controller('loads')
export class LoadController {
  constructor(private readonly loadService: LoadService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, ShipperGuard)
  @PermissionsDecorator({
    module: Module_Names.Loads,
    key: LoadsModuleKeys.CREATE_LOAD,
  })
  @ApiResponse({
    status: 201,
    description: 'Load created',
    type: CreateLoadResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async create(@Request() req, @Body() input: CreateLoadDto) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.loadService.create(input, {
        associatedTo: getAssociationId(user),
        createdBy: user.id,
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
    module: Module_Names.Loads,
    key: LoadsModuleKeys.LIST_LOADS,
  })
  @ApiResponse({
    status: 200,
    description: 'Loads received.',
    type: ListLoadResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async findAll() {
    try {
      const output = await this.loadService.findAll();
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
    module: Module_Names.Loads,
    key: LoadsModuleKeys.VIEW_LOAD,
  })
  @ApiParam({ name: 'id', type: Number, description: 'id of load' })
  @ApiResponse({
    status: 200,
    description: 'Role received.',
    type: GetLoadResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async findOne(@Param('id') id: number) {
    try {
      const output = await this.loadService.findOne(id);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Patch('/')
  @UseGuards(JwtAuthGuard, ShipperGuard)
  @PermissionsDecorator({
    module: Module_Names.Loads,
    key: LoadsModuleKeys.UPDATE_LOAD,
  })
  @ApiResponse({
    status: 200,
    description: 'Load updated',
    type: UpdateLoadResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async update(@Request() req, @Body() input: UpdateLoadDto) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.loadService.update(
        input,
        getAssociationId(user),
      );
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ShipperGuard)
  @PermissionsDecorator({
    module: Module_Names.Loads,
    key: LoadsModuleKeys.DELETE_LOAD,
  })
  @ApiParam({ name: 'id', type: Number, description: 'id of load' })
  @ApiResponse({
    status: 200,
    description: 'Role deleted.',
    type: DeleteLoadResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async delete(@Request() req, @Param('id') id: number) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.loadService.remove(id, getAssociationId(user));
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }
}
