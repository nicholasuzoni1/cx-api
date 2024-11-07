import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Delete,
  Body,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/guards/jwt-auth.guard';
import { UserTokenPayloadType } from '@app/permission-management';
import { responseWrapper } from '@app/shared-lib';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';
import { DeleteCardDto } from './dto/delete-card.dto';
import { AddCardDto } from './dto/add-card.dto';

@ApiBearerAuth()
@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/cards')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Add card',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async addCard(@Request() req, @Body() data: AddCardDto) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.paymentService.addCard(data);

      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/cards/:customerId')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'customerId', type: String, description: 'Customer Id' })
  @ApiResponse({
    status: 201,
    description: 'List cards',
    type: Array<Stripe.PaymentMethod>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async list(@Request() req, @Param('customerId') customerId: string) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.paymentService.listCards(customerId);

      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete('/cards')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Remove card',
    type: Boolean,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async removeCard(@Request() req, @Body() data: DeleteCardDto) {
    try {
      const user = req.user as UserTokenPayloadType;
      const output = await this.paymentService.removeCard(
        data?.paymentMethodId,
      );

      return responseWrapper({
        data: output,
      });
    } catch (error) {
      throw error;
    }
  }
}
