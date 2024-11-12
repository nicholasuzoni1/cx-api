import moment from 'moment';
import { UpdateLoadDto } from '../dto/update-load.dto';
import { LoadEntity } from 'apps/cx-api/entities/load.entity';
import { LoadDetailsEntity } from 'apps/cx-api/entities/load-details.entity';
import { LoadResponseEntity } from '../entities/load.response';
import { LoadDetailsResponseEntity } from '../entities/load.response';
import { Vehicle_Type } from '@app/load-managment/vehicle-types';
import { Weight_Unit_Type } from '@app/load-managment/weight-types';
import { Dimension_Unit_Type } from '@app/load-managment/dimension-types';
import {
  CreateLoadDto,
  LoadAdditionalData,
  CreateLoadDetailsDto,
} from '../dto/create-load.dto';

export class LoadConverter {
  static toCreateInput(
    input: CreateLoadDto,
    additionalData: LoadAdditionalData,
  ) {
    const output = new LoadEntity();

    output.shipper_id = additionalData.shipperId;
    output.min_budget = input.minBudget;
    output.max_budget = input.maxBudget;
    output.is_private = input?.isPrivate || false;
    output.is_contract_made = input?.isContractMade || false;
    output.status = input?.status;
    output.created_by = additionalData.createdBy;

    output.loadDetails = input.loadDetails.map(
      (input: CreateLoadDetailsDto) => {
        const output = new LoadDetailsEntity();

        output.load_uid = input.loadUid;
        output.title = input.title;
        output.load_type = input.loadType;
        output.vehicle_type = input.vehicleType;
        output.weight_unit = input.weightUnit;
        output.weight = input.weight;
        output.dimension_unit = input.dimensionUnit;
        output.dimensions = {
          length: input.dimensions.length,
          width: input.dimensions.width,
          height: input.dimensions.height,
        };

        if (input?.pickupDateTime) {
          output.pickup_datetime = moment(input.pickupDateTime).utc().toDate();
        }

        if (input?.arrivalDateTime) {
          output.arrival_datetime = moment(input.arrivalDateTime)
            .utc()
            .toDate();
        }

        if (
          input?.pickupLocation?.address &&
          input?.pickupLocation?.lat &&
          input?.pickupLocation?.lng
        ) {
          output.pickup_location = {
            address: input.pickupLocation.address,
            lat: input.pickupLocation.lat,
            lng: input.pickupLocation.lng,
          };
        }

        if (
          input?.destinationLocation?.address &&
          input?.destinationLocation?.lat &&
          input?.destinationLocation?.lng
        ) {
          output.destination_location = {
            address: input.destinationLocation.address,
            lat: input.destinationLocation.lat,
            lng: input.destinationLocation.lng,
          };
        }

        output.created_by = additionalData.createdBy;
        output.order = input?.order;

        return output;
      },
    );

    return output;
  }

  static fromTable(res: LoadEntity) {
    const output = new LoadResponseEntity();

    output.id = res.id;
    output.minBudget = res?.min_budget || null;
    output.maxBudget = res?.max_budget || null;
    output.isPrivate = res?.is_private || false;
    output.status = res?.status || null;
    output.shipperId = res.shipper_id;
    output.createdBy = res.created_by;
    output.createdAt = res.created_at.toISOString();
    output.updatedAt = res.updated_at.toISOString();
    output.deletedAt = res.deleted_at?.toISOString();

    output.loadDetails = res.loadDetails.map((subLoad: LoadDetailsEntity) => {
      const output = new LoadDetailsResponseEntity();

      output.id = subLoad?.id;
      output.loadUid = subLoad?.load_uid || null;
      output.title = subLoad?.title || null;
      output.loadType = subLoad?.load_type || null;
      output.vehicleType = (subLoad?.vehicle_type as Vehicle_Type) || null;
      output.weightUnit = (subLoad?.weight_unit as Weight_Unit_Type) || null;
      output.weight = subLoad?.weight || null;
      output.order = subLoad?.order;
      output.status = subLoad?.status;

      output.dimensionUnit =
        (subLoad?.dimension_unit as Dimension_Unit_Type) || null;
      output.dimensions = {
        length: subLoad?.dimensions?.length || null,
        width: subLoad?.dimensions?.width || null,
        height: subLoad?.dimensions?.height || null,
      };

      output.pickupDateTime = subLoad?.pickup_datetime
        ? moment(subLoad?.pickup_datetime).utc().toISOString()
        : null;
      output.arrivalDateTime = subLoad?.arrival_datetime
        ? moment(subLoad.arrival_datetime).utc().toISOString()
        : null;

      output.pickupLocation =
        subLoad?.pickup_location?.address &&
        subLoad?.pickup_location?.lat &&
        subLoad?.pickup_location?.lng
          ? {
              address: subLoad?.pickup_location?.address || null,
              lat: subLoad?.pickup_location?.lat || null,
              lng: subLoad?.pickup_location?.lng || null,
            }
          : null;

      output.destinationLocation =
        subLoad?.destination_location?.address &&
        subLoad?.destination_location?.lat &&
        subLoad?.destination_location?.lng
          ? {
              address: subLoad?.destination_location?.address || null,
              lat: subLoad?.destination_location?.lat || null,
              lng: subLoad?.destination_location?.lng || null,
            }
          : null;

      return output;
    });

    return output;
  }

  static toUpdateInput(input: UpdateLoadDto) {
    const output = new LoadEntity();

    const loadId = input?.id;
    const createdBy = input?.createdBy;

    output.id = input?.id;
    output.min_budget = input?.minBudget;
    output.max_budget = input?.maxBudget;
    output.is_private = input?.isPrivate || false;
    output.is_contract_made = input?.isContractMade || false;
    output.status = input?.status;

    output.loadDetails = input?.loadDetails.map(
      (input: Partial<CreateLoadDetailsDto>) => {
        const output = new LoadDetailsEntity();

        output.load_uid = input.loadUid;
        output.title = input?.title;
        output.load_type = input.loadType;
        output.vehicle_type = input.vehicleType;
        output.weight_unit = input.weightUnit;
        output.weight = input.weight;
        output.dimension_unit = input.dimensionUnit;
        output.order = input.order;
        output.loadId = loadId;
        output.created_by = createdBy;

        output.dimensions = {
          length: input.dimensions.length,
          width: input.dimensions.width,
          height: input.dimensions.height,
        };

        if (input?.pickupDateTime) {
          output.pickup_datetime = moment(input.pickupDateTime).utc().toDate();
        }

        if (input?.arrivalDateTime) {
          output.arrival_datetime = moment(input.arrivalDateTime)
            .utc()
            .toDate();
        }

        if (
          input?.pickupLocation?.address &&
          input?.pickupLocation?.lat &&
          input?.pickupLocation?.lng
        ) {
          output.pickup_location = {
            address: input.pickupLocation.address,
            lat: input.pickupLocation.lat,
            lng: input.pickupLocation.lng,
          };
        }

        if (
          input?.destinationLocation?.address &&
          input?.destinationLocation?.lat &&
          input?.destinationLocation?.lng
        ) {
          output.destination_location = {
            address: input.destinationLocation.address,
            lat: input.destinationLocation.lat,
            lng: input.destinationLocation.lng,
          };
        }

        return output;
      },
    );

    return output;
  }
}
