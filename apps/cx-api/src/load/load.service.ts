import { Injectable } from '@nestjs/common';
import { CreateLoadDto, LoadAdditionalData } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoadEntity } from 'apps/cx-api/entities/load.entity';
import { NotFoundErrorHttp } from '@app/shared-lib/http-errors';
import { LangKeys } from '@app/lang-lib/lang-keys';
import { LoadConverter } from './converters/load';
import { VehicleTypeConverter } from './converters/vehicle-types';
import { SearchLoadsDto } from './dto/search-loads';
import { Dimension_Unit_List } from '@app/load-managment/dimension-types';
import { Weight_Unit_List } from '@app/load-managment/weight-types';
import { DataforLoadPostingResponseEntity } from './entities/data-for-load-posting.response';
import { LoadDetailsEntity } from 'apps/cx-api/entities/load-details.entity';
import { LoadStatus } from '@app/load-managment/enums/load-statuses';
import { VehicleTypeEntity } from 'apps/cx-api/entities/vehicle-type.entity';
import { Vehicle_Type_NamedDescriptions } from '@app/load-managment/vehicle-types';
import { CostEstimationService } from '../cost-estimation/cost-estimation.service';
import { LoadResponseEntity } from './entities/load.response';

@Injectable()
export class LoadService {
  constructor(
    @InjectRepository(LoadEntity)
    private readonly loadEntity: Repository<LoadEntity>,
    @InjectRepository(LoadDetailsEntity)
    private readonly loadDetailsEntity: Repository<LoadDetailsEntity>,
    @InjectRepository(VehicleTypeEntity)
    private readonly vehicleTypesEntity: Repository<VehicleTypeEntity>,
    private readonly costEstimationService: CostEstimationService,
  ) {}

  async getDataforLoadPosting() {
    try {
      const output = new DataforLoadPostingResponseEntity();

      const vehicleTypesWithLoad = await this.vehicleTypesEntity
        .createQueryBuilder('vehicle_type')
        .leftJoinAndSelect('vehicle_type.vehicleLoadTypes', 'vehicleLoadType')
        .leftJoinAndSelect('vehicleLoadType.load_type', 'loadType')
        .select([
          'vehicle_type.id',
          'vehicle_type.name',
          'vehicle_type.description',
          'loadType.id',
          'loadType.name',
          'loadType.description',
          'vehicleLoadType.rate_per_mile',
        ])
        .getMany();

      output.dimensionUnits = Dimension_Unit_List as string[];
      output.weightUnits = Weight_Unit_List as string[];
      output.vehicleTypes = Vehicle_Type_NamedDescriptions;

      output.vehicleTypesWithLoad = vehicleTypesWithLoad.map(
        (vehicleTypeWithLoad) =>
          VehicleTypeConverter.fromTable(vehicleTypeWithLoad),
      );

      return output;
    } catch (error) {
      throw error;
    }
  }

  async findAll({
    shipperId,
    page,
    limit,
    status,
  }: {
    shipperId: number;
    page: number;
    limit: number;
    status: LoadStatus;
  }) {
    try {
      const conditions = {
        shipper_id: shipperId,
      };

      if (status) {
        conditions['status'] = status;
      }

      const [loads, total] = await this.loadEntity.findAndCount({
        where: conditions,
        relations: [
          'bids',
          'contract',
          'loadDetails',
          'loadDetails.vehicle_type',
          'loadDetails.load_type',
        ],
        skip: (page - 1) * limit,
        take: limit,
      });

      const output = await Promise.all(
        loads.map(async (l) => {
          const output = LoadConverter.fromTable(l);
          await this.mapBudgetEstimates(l, output);
          return output;
        }),
      );

      return {
        data: output,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const load = await this.loadEntity.findOne({
        where: { id },
        relations: {
          loadDetails: {
            vehicle_type: true,
            load_type: true,
          },
        },
      });

      if (!load) {
        throw new NotFoundErrorHttp(LangKeys.LoadNotFoundErrorKey);
      }

      const output = LoadConverter.fromTable(load);

      await this.mapBudgetEstimates(load, output);

      return output;
    } catch (error) {
      throw error;
    }
  }

  async checkDraft(shipperId: number) {
    try {
      const draftLoad = await this.loadEntity.findOne({
        where: {
          shipper_id: shipperId,
          status: 'draft',
        },
        relations: [
          'loadDetails',
          'loadDetails.vehicle_type',
          'loadDetails.load_type',
        ],
      });

      const output = LoadConverter.fromTable(draftLoad);

      await this.mapBudgetEstimates(draftLoad, output);

      return output;
    } catch (error) {
      throw error;
    }
  }

  async create(load: CreateLoadDto, additionalData: LoadAdditionalData) {
    try {
      const parsedLoad = LoadConverter.toCreateInput(load, additionalData);
      const newLoad = await this.loadEntity.save(parsedLoad);
      const newLoadWithRelations = await this.findOne(newLoad?.id);

      return newLoadWithRelations;
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

  async update(input: UpdateLoadDto, loadId: number) {
    try {
      const updateLoad = LoadConverter.toUpdateInput(input);

      const { loadDetails, ...load } = updateLoad;

      const existingLoadDetails = await this.loadDetailsEntity.find({
        where: {
          loadId,
        },
        select: ['load_uid'],
      });

      const existingLoadUids = existingLoadDetails.map(
        (detail) => detail.load_uid,
      );

      const newLoadUids = loadDetails.map(
        (loadDetails) => loadDetails?.load_uid,
      );

      const loadUidsToRemove = existingLoadUids.filter(
        (uid) => !newLoadUids.includes(uid),
      );

      await this.loadEntity.update({ id: loadId }, load);

      // Upcerting the load details
      const promisesArray = (loadDetails || []).map((loadDetail) => {
        if (!existingLoadUids.includes(loadDetail.load_uid)) {
          return this.loadDetailsEntity.save(loadDetail);
        } else {
          return this.loadDetailsEntity.update(
            { id: loadDetail.id },
            { ...loadDetail },
          );
        }
      });

      // Removing the discarded load details
      promisesArray.push(
        ...loadUidsToRemove.map((uid) => {
          return this.loadDetailsEntity.softDelete({ load_uid: uid });
        }),
      );

      await Promise.all(promisesArray);

      const loadResponse = await this.findOne(loadId);

      return loadResponse;
    } catch (error) {
      throw error;
    }
  }

  async postLoad(loadId: number) {
    try {
      const loadDetailsIds = [];

      const load = await this.loadEntity.findOne({
        where: {
          id: loadId,
        },
        relations: ['loadDetails'],
      });

      const loadDetails = load?.loadDetails || [];

      // Check load details
      if (!loadDetails.length) {
        // Need to update
        throw new NotFoundErrorHttp(LangKeys.LoadDetailsNotComplete);
      }

      // Check load budget
      if (!load?.min_budget || !load?.max_budget) {
        // Need to update
        throw new NotFoundErrorHttp(LangKeys.LoadDetailsNotComplete);
      }

      // Check location details in load details
      for (const loadDetail of loadDetails) {
        const {
          pickup_location,
          destination_location,
          pickup_datetime,
          arrival_datetime,
          id,
        } = loadDetail;

        if (
          !pickup_location?.address ||
          !destination_location?.address ||
          !pickup_datetime ||
          !arrival_datetime
        ) {
          throw new NotFoundErrorHttp(LangKeys.LoadDetailsNotComplete);
        }

        loadDetailsIds.push(id);
      }

      await Promise.all([
        this.loadEntity.update({ id: loadId }, { status: LoadStatus.ACTIVE }),
        this.loadDetailsEntity.update(
          { id: In(loadDetailsIds) },
          { status: LoadStatus.ACTIVE },
        ),
      ]);

      return {};
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

  async mapBudgetEstimates(load: LoadEntity, response: LoadResponseEntity) {
    const budgetEstimates = await this.costEstimationService.estimateCost(load);

    response.loadDetails = response.loadDetails.map((loadDetail) => {
      const estimates = budgetEstimates?.budgetEstimatesDivision?.find(
        (estimate) => estimate?.subLoadId === loadDetail?.id,
      );
      loadDetail.estimatedBudget = estimates?.estimatedCost;

      return loadDetail;
    });

    response.estimatedBudget = budgetEstimates?.totalEstimatedBudget;
  }
}
