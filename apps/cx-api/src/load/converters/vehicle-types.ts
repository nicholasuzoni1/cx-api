import { VehicleTypeEntity } from 'apps/cx-api/entities/vehicle-type.entity';
import { VehicleTypeResponseEntity } from '../entities/vehicle-type.response';

export class VehicleTypeConverter {
  static fromTable(res: VehicleTypeEntity) {
    const output = new VehicleTypeResponseEntity();

    output.id = res?.id;
    output.name = res?.name || null;
    output.description = res?.description || null;

    output.vehicleLoadTypes = res?.vehicleLoadTypes.map((loadTypeDetail) => {
      return {
        ratePerMile: loadTypeDetail?.rate_per_mile,
        loadType: loadTypeDetail?.load_type,
      };
    });

    output.createdBy = res?.created_by;
    output.createdAt = res?.created_at?.toISOString();
    output.updatedAt = res?.updated_at?.toISOString();
    output.deletedAt = res?.deleted_at?.toISOString();

    return output;
  }
}
