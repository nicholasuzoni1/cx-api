import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CarrierGuard } from '../guard/guards/carrier.guard';
import { JwtAuthGuard } from '../guard/guards/jwt-auth.guard';
import { PermissionsDecorator } from '@app/shared-lib/decorators/permissions.decorator';
import { Module_Names } from '@app/permission-management/permission-module-keys';
import { CreateBidResponseType } from './entities/create-bid.response';
import { BidsModuleKeys } from '@app/permission-management/permission-module-keys/modules/bids';
import { UserTokenPayloadType } from '@app/permission-management';
import { getAssociationId } from '@app/permission-management/get-association';
import { responseWrapper } from '@app/shared-lib';
import { CommonPermissionGuard } from '../guard/guards/common-permission.guard';
import { GetBidResponseType } from './entities/get-bid.response';
import { UpdateBidResponseType } from './entities/update-bid.response';
import { DeleteBidResponseType } from './entities/delete-bid.response';

@ApiBearerAuth()
@ApiTags('Bids')
@Controller('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, CarrierGuard)
  @PermissionsDecorator({
    module: Module_Names.Bids,
    key: BidsModuleKeys.CREATE_BID,
  })
  @ApiResponse({
    status: 201,
    description: 'Bid created',
    type: CreateBidResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async create(@Request() req, @Body() input: CreateBidDto) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.bidService.create(input, {
        createdBy: user.id,
        carrierId: getAssociationId(user),
      });
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
    module: Module_Names.Bids,
    key: BidsModuleKeys.VIEW_BID,
  })
  @ApiResponse({
    status: 201,
    description: 'Bid received.',
    type: GetBidResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async findOne(@Param('id') id: number) {
    try {
      const output = await this.bidService.findOne(id);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard, CarrierGuard)
  @PermissionsDecorator({
    module: Module_Names.Bids,
    key: BidsModuleKeys.UPDATE_BID,
  })
  @ApiResponse({
    status: 201,
    description: 'Bid updated',
    type: UpdateBidResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async update(@Body() updateBidDto: UpdateBidDto) {
    try {
      const output = await this.bidService.update(updateBidDto);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, CarrierGuard)
  @PermissionsDecorator({
    module: Module_Names.Bids,
    key: BidsModuleKeys.UPDATE_BID,
  })
  @ApiResponse({
    status: 201,
    description: 'Bid deleted',
    type: DeleteBidResponseType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async remove(@Param('id') id: number) {
    try {
      const output = await this.bidService.remove(id);
      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }
}
