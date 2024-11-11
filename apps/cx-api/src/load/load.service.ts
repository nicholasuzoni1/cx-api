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
import { Dimension_Unit_List } from '@app/load-managment/dimension-types';
import { Vehicle_Type_NamedDescriptions } from '@app/load-managment/vehicle-types';
import { Weight_Unit_List } from '@app/load-managment/weight-types';
import { DataforLoadPostingResponseEntity } from './entities/data-for-load-posting.response';
import { Contract_Names } from '@app/load-managment/contract-types';
import { LoadDetailsEntity } from 'apps/cx-api/entities/load-details.entity';

@Injectable()
export class LoadService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(LoadEntity)
    private readonly loadEntity: Repository<LoadEntity>,
    @InjectRepository(LoadDetailsEntity)
    private readonly loadDetailsEntity: Repository<LoadDetailsEntity>,
    private readonly dataSource: DataSource,
  ) {}

  getDataforLoadPosting() {
    try {
      const output = new DataforLoadPostingResponseEntity();
      output.dimensionUnits = Dimension_Unit_List as string[];
      output.weightUnits = Weight_Unit_List as string[];
      output.vehicleTypes = Vehicle_Type_NamedDescriptions;

      return output;
    } catch (error) {
      throw error;
    }
  }

  async create(load: CreateLoadDto, additionalData: LoadAdditionalData) {
    try {
      const user = await this.userEntity.findOne({
        where: { id: additionalData?.createdBy },
      });

      if (!user) {
        throw new AlreadyExistsErrorHttp(LangKeys.AccountAlreadyExistsKey);
      }

      const parsedLoad = LoadConverter.toCreateInput(load, additionalData);
      const newLoad = await this.loadEntity.save(parsedLoad);

      return LoadConverter.fromTable(newLoad);
    } catch (error) {
      throw error;
    }
  }

  async findAll({
    shipperId,
    page,
    limit,
  }: {
    shipperId: number;
    page: number;
    limit: number;
  }) {
    try {
      const [loads, total] = await this.loadEntity.findAndCount({
        where: {
          shipper_id: shipperId,
        },
        relations: ['bids', 'contract', 'loadDetails'],
        skip: (page - 1) * limit,
        take: limit,
      });

      const output = loads.map((l) => {
        return LoadConverter.fromTable(l);
      });

      return {
        data: loads,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.loadEntity.softDelete(id);
      await this.loadDetailsEntity.softDelete({ load: { id } });

      const output = {};
      return output;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const load = await this.loadEntity.findOne({
        where: { id },
        relations: ['loadDetails'],
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
        relations: ['loadDetails'],
      });

      if (!load) {
        throw new NotFoundErrorHttp(LangKeys.LoadNotFoundErrorKey);
      }

      load = LoadConverter.toUpdateInput(load, input);

      //const savedLoad = await this.loadEntity.update({ id: input.id }, load);
      const savedLoad = await this.loadEntity.save(load);

      const output = LoadConverter.fromTable(savedLoad);
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
      countQuery.andWhere('loads.is_contract_made = :isContractMade', {
        isContractMade: false,
      });

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

      const [query, parameters] = countQuery.getQueryAndParameters();
      console.log('SQL Query:', query);
      console.log('Parameters:', parameters);

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
}
