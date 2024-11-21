import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleLoadTypeEntity } from 'apps/cx-api/entities/vehicle-load-type.entity';
import { CreateLoadDto } from '../load/dto/create-load.dto';
import { LoadEntity } from 'apps/cx-api/entities/load.entity';

@Injectable()
export class CostEstimationService {
  constructor(
    @InjectRepository(VehicleLoadTypeEntity)
    private readonly vehicleLoadTypeEntity: Repository<VehicleLoadTypeEntity>,
  ) {}

  async estimateCost(load: LoadEntity): Promise<{
    totalEstimatedBudget: number | null;
    budgetEstimatesDivision: Array<{
      subLoadId: number;
      estimatedCost: number | null;
    }>;
  }> {
    const response = {
      totalEstimatedBudget: null,
      budgetEstimatesDivision: [],
    };

    const loadDetails = load?.loadDetails || [];

    if (loadDetails.length) {
      const loadTypeId = loadDetails?.[0]?.load_type_id;
      const vehicleTypeId = loadDetails?.[0]?.vehicle_type_id;

      const perMileRate =
        (
          await this.vehicleLoadTypeEntity.findOne({
            where: {
              vehicleTypeId,
              loadTypeId,
            },
          })
        )?.rate_per_mile || 0;

      response.budgetEstimatesDivision = loadDetails.map((loadDetail) => {
        const currentMilage = Number(loadDetail?.milage) || 0;
        const estimatedCost = currentMilage * Number(perMileRate) || 0;

        return {
          subLoadId: loadDetail?.id,
          estimatedCost,
        };
      });

      response.totalEstimatedBudget = loadDetails.reduce((acc, loadDetail) => {
        const currentMilage = Number(loadDetail?.milage) || 0;
        const totalRateForStopOver = currentMilage * Number(perMileRate) || 0;

        return acc + totalRateForStopOver;
      }, 0);
    }

    return response;
  }
}
