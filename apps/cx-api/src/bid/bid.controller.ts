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

@ApiBearerAuth()
@ApiTags('Bids')
@Controller('bid')
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

  @Get()
  findAll() {
    return this.bidService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bidService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto) {
    return this.bidService.update(+id, updateBidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bidService.remove(+id);
  }
}
