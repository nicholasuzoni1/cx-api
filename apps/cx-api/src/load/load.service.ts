import { Injectable } from '@nestjs/common';
import { CreateLoadDto, LoadAdditionalData } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoadEntity } from 'apps/cx-api/entities/load.entity';
import {
  AlreadyExistsErrorHttp,
  NotFoundErrorHttp,
} from '@app/shared-lib/http-errors';
import { LangKeys } from '@app/lang-lib/lang-keys';
import { LoadConverter } from './converters/load';
import { SearchLoadsDto } from './dto/search-loads';

@Injectable()
export class LoadService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(LoadEntity)
    private readonly loadEntity: Repository<LoadEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(input: CreateLoadDto, additionalData: LoadAdditionalData) {
    try {
      const user = await this.userEntity.findOne({
        where: {
          id: additionalData.createdBy,
        },
      });

      if (!user) {
        throw new AlreadyExistsErrorHttp(LangKeys.AccountAlreadyExistsKey);
      }

      let newLoad = this.loadEntity.create();

      newLoad = LoadConverter.toCreateInput(newLoad, input, additionalData);

      const savedLoad = await this.loadEntity.save(newLoad);

      const output = LoadConverter.fromTable(savedLoad);
      return output;
    } catch (error) {
      throw error;
    }
  }

  async findAll(id: number) {
    try {
      const loads = await this.loadEntity.find({
        where: {
          shipper_id: id,
        },
        relations: ['bids', 'contract', 'statuses'],
      });

      console.log(
        'Loads',
        loads.map((l) => l.bids),
      );

      const output = loads.map((l) => {
        return LoadConverter.fromTable(l);
      });

      return output;
    } catch (error) {
      throw error;
    }
  }

  async searchLoads(options: SearchLoadsDto) {
    try {
      const { limit = 10, pageNumber = 1 } = options;

      // Calculate offset based on page number and limit
      const offset = (pageNumber - 1) * limit;

      // Build the base query for counting total records
      const countQuery = this.loadEntity.createQueryBuilder('loads');

      countQuery.andWhere('loads.is_private = :isPrivate', {
        isPrivate: false,
      });
      // Filter for loads without a contract
      countQuery.andWhere('loads.contract IS NULL');

      // Apply filters to the count query
      // if (destination) {
      //   countQuery.andWhere('load.destination = :destination', { destination });
      // }

      // Add geographic filter if lat, lng, and radius are provided
      // if (lat && lng && radius) {
      //   countQuery.andWhere(
      //     `
      //     ST_Distance_Sphere(
      //       point(load.longitude, load.latitude),
      //       point(:lng, :lat)
      //     ) <= :radius
      //   `,
      //     { lat, lng, radius },
      //   );
      // }

      // Get total count of records matching the filters and location
      const totalCount = await countQuery.getCount();

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / limit);

      // Check if the requested page number is valid
      if (pageNumber > totalPages) {
        return {
          totalCount,
          loadsPerPage: [],
          limit,
          pageNumber,
          totalPages,
        };
      }

      // Clone the count query to reuse the same filters for fetching paginated results
      const paginatedQuery = countQuery.clone();

      // Pagination: Apply limit and calculated offset
      paginatedQuery.take(limit).skip(offset);

      // Fetch the paginated records
      const loads = await paginatedQuery.getMany();

      // Convert the loads
      const output = loads.map((l) => LoadConverter.fromTable(l));

      // Return the paginated response with geographic filtering included
      return {
        totalCount, // Total number of matching records
        loadsPerPage: output, // Loads for the current page
        limit, // Number of records per page
        pageNumber, // Current page number
        totalPages, // Total number of pages
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const load = await this.loadEntity.findOne({
        where: {
          id: id,
        },
      });

      if (!load) {
        throw new NotFoundErrorHttp(LangKeys.LoadNotFoundErrorKey);
      }

      const output = LoadConverter.fromTable(load);
      return output;
    } catch (error) {
      throw error;
    }
  }

  async update(input: UpdateLoadDto, associatedTo: number) {
    try {
      let load = await this.loadEntity.findOne({
        where: {
          id: input.id,
          shipper_id: associatedTo,
        },
      });

      if (!load) {
        throw new NotFoundErrorHttp(LangKeys.LoadNotFoundErrorKey);
      }

      load = LoadConverter.toUpdateInput(load, input);

      const savedLoad = await this.loadEntity.save(load);

      const output = LoadConverter.fromTable(savedLoad);
      return output;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, associatedTo: number) {
    try {
      const load = await this.loadEntity.findOne({
        where: {
          id: id,
          shipper_id: associatedTo,
        },
      });

      if (!load) {
        throw new NotFoundErrorHttp(LangKeys.LoadNotFoundErrorKey);
      }

      this.loadEntity.softDelete(load);

      const output = {};
      return output;
    } catch (error) {
      throw error;
    }
  }
}
