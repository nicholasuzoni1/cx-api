import { Injectable } from '@nestjs/common';
import { BidAdditionalData, CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BidEntity } from 'apps/cx-api/entities/bid.entity';
import {
  AlreadyExistsErrorHttp,
  NotFoundErrorHttp,
} from '@app/shared-lib/http-errors';
import { LangKeys } from '@app/lang-lib/lang-keys';
import { BidResponseEntity } from './entities/bid.entity.response';
import { LoadEntity } from 'apps/cx-api/entities/load.entity';
import { BidConverter } from './converters/bid';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(BidEntity)
    private readonly bidEntity: Repository<BidEntity>,
    @InjectRepository(LoadEntity)
    private readonly loadEntity: Repository<LoadEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(input: CreateBidDto, additionalData: BidAdditionalData) {
    try {
      const user = await this.userEntity.findOne({
        where: {
          id: additionalData.createdBy,
        },
      });

      if (!user) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      const bid = await this.bidEntity.findOne({
        where: {
          carrier_id: additionalData.carrierId,
          load: {
            id: input.loadId,
          },
        },
      });
      if (bid) {
        throw new AlreadyExistsErrorHttp(LangKeys.DuplicateBidErrorKey);
      }

      const load = await this.loadEntity.findOne({
        where: {
          id: input.loadId,
        },
      });
      if (!load) {
        throw new AlreadyExistsErrorHttp(LangKeys.LoadNotFoundErrorKey);
      }

      let newBid = this.bidEntity.create();

      newBid = BidConverter.toCreateInput(newBid, input, additionalData);

      const savedBid = await this.bidEntity.save(newBid);

      const output = new BidResponseEntity();

      output.id = savedBid.id;
      output.price = savedBid.price;
      output.carrierId = savedBid.carrier_id;
      output.createdBy = savedBid.created_by;
      output.createdAt = savedBid.created_at.toISOString();
      output.updatedAt = savedBid.updated_at.toISOString();
      output.deletedAt = savedBid.deleted_at?.toISOString();

      return output;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all bid`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bid`;
  }

  update(id: number, updateBidDto: UpdateBidDto) {
    return `This action updates a #${id} bid`;
  }

  remove(id: number) {
    return `This action removes a #${id} bid`;
  }
}
