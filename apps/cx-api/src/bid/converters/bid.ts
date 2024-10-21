import { BidEntity } from 'apps/cx-api/entities/bid.entity';
import { BidAdditionalData, CreateBidDto } from '../dto/create-bid.dto';
import { BidResponseEntity } from '../entities/bid.entity.response';
import { UpdateBidDto } from '../dto/update-bid.dto';

export class BidConverter {
  static toCreateInput(
    output: BidEntity,
    input: CreateBidDto,
    additionalData: BidAdditionalData,
  ) {
    output.price = input.price;
    output.created_by = additionalData.createdBy;
    output.carrier_id = additionalData.carrierId;
    output.load = {
      ...output.load,
      id: input.loadId,
    };

    return output;
  }

  static toUpdateInput(output: BidEntity, input: UpdateBidDto) {
    output.id = input.id;
    output.price = input.price;
    return output;
  }

  static fromTable(res: BidEntity) {
    const output = new BidResponseEntity();
    output.id = res.id;
    output.price = res.price;
    output.carrierId = res.carrier_id;
    output.createdBy = res.created_by;
    output.createdAt = res.created_at.toISOString();
    output.updatedAt = res.updated_at.toISOString();
    output.deletedAt = res.deleted_at?.toISOString();

    return output;
  }
}
