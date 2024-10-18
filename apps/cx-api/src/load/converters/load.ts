import { LoadEntity } from 'apps/cx-api/entities/load.entity';
import { LoadResponseEntity } from '../entities/load.response';
import { Vehicle_Type } from '@app/load-managment/vehicle-types';
import { Weight_Unit_Type } from '@app/load-managment/weight-types';
import { Dimension_Unit_Type } from '@app/load-managment/dimension-types';
import moment from 'moment';
import { CreateLoadDto, LoadAdditionalData } from '../dto/create-load.dto';
import { UpdateLoadDto } from '../dto/update-load.dto';

export class LoadConverter {
  static toCreateInput(
    output: LoadEntity,
    input: CreateLoadDto,
    additionalData: LoadAdditionalData,
  ) {
    output.title = input.title;
    output.load_type = input.loadType;
    output.vehicle_type = input.vehicleType;
    output.min_budget = input.minBudget;
    output.max_budget = input.maxBudget;
    output.weight_unit = input.weightUnit;
    output.weight = input.weight;
    output.dimension_unit = input.dimension_unit;
    output.dimensions = {
      length: input.dimensions.length,
      width: input.dimensions.width,
      height: input.dimensions.height,
    };
    output.pickup_datetime = moment(input.pickupDateTime).utc().toDate();
    output.arrival_datetime = moment(input.arrivalDateTime).utc().toDate();
    output.pickup_location = {
      address: input.pickupLocation.address,
      lat: input.pickupLocation.lat,
      lng: input.pickupLocation.lng,
    };
    output.destination_location = {
      address: input.destinationLocation.address,
      lat: input.destinationLocation.lat,
      lng: input.destinationLocation.lng,
    };
    output.isPrivate = false;
    output.associated_to = additionalData.associatedTo;
    output.created_by = additionalData.createdBy;

    return output;
  }

  static toUpdateInput(output: LoadEntity, input: UpdateLoadDto) {
    output.title = input.title;
    output.load_type = input.loadType;
    output.vehicle_type = input.vehicleType;
    output.min_budget = input.minBudget;
    output.max_budget = input.maxBudget;
    output.weight_unit = input.weightUnit;
    output.weight = input.weight;
    output.dimension_unit = input.dimension_unit;
    output.dimensions = {
      length: input.dimensions.length,
      width: input.dimensions.width,
      height: input.dimensions.height,
    };
    output.pickup_datetime = moment(input.pickupDateTime).utc().toDate();
    output.arrival_datetime = moment(input.arrivalDateTime).utc().toDate();
    output.pickup_location = {
      address: input.pickupLocation.address,
      lat: input.pickupLocation.lat,
      lng: input.pickupLocation.lng,
    };
    output.destination_location = {
      address: input.destinationLocation.address,
      lat: input.destinationLocation.lat,
      lng: input.destinationLocation.lng,
    };
    output.isPrivate = false;

    return output;
  }

  static fromTable(res: LoadEntity) {
    const output = new LoadResponseEntity();

    output.id = res.id;
    output.title = res.title;
    output.loadType = res.load_type;
    output.vehicleType = res.vehicle_type as Vehicle_Type;
    output.minBudget = res.min_budget;
    output.maxBudget = res.max_budget;
    output.weightUnit = res.weight_unit as Weight_Unit_Type;
    output.weight = res.weight;
    output.dimension_unit = res.dimension_unit as Dimension_Unit_Type;
    output.dimensions = {
      length: res.dimensions.length,
      width: res.dimensions.width,
      height: res.dimensions.height,
    };
    output.pickupDateTime = moment(res.pickup_datetime).utc().toISOString();
    output.arrivalDateTime = moment(res.arrival_datetime).utc().toISOString();
    output.pickupLocation = {
      address: res.pickup_location.address,
      lat: res.pickup_location.lat,
      lng: res.pickup_location.lng,
    };
    output.destinationLocation = {
      address: res.destination_location.address,
      lat: res.destination_location.lat,
      lng: res.destination_location.lng,
    };
    output.isPrivate = false;
    output.asssociatedTo = res.associated_to;
    output.createdBy = res.created_by;
    output.createdAt = res.created_at.toISOString();
    output.updatedAt = res.updated_at.toISOString();
    output.deletedAt = res.deleted_at?.toISOString();

    return output;
  }
}
