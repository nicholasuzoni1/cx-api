import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { VehicleTypeEntity } from 'apps/cx-api/entities/vehicle-type.entity';
import { LoadTypeEntity } from 'apps/cx-api/entities/load-type.entity';
import { VehicleLoadTypeEntity } from 'apps/cx-api/entities/vehicle-load-type.entity';

@Injectable()
export class SeederService {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const vehicleTypeRepo = this.dataSource.getRepository(VehicleTypeEntity);
    const loadTypeRepo = this.dataSource.getRepository(LoadTypeEntity);
    const mappingRepo = this.dataSource.getRepository(VehicleLoadTypeEntity);

    const vehicleTypes = [
      {
        name: 'Flatbed Truck',
        description: 'Open flat surface, used for large or heavy goods.',
        created_by: 1,
      },
      {
        name: 'Box Truck (Cargo Truck / Van)',
        description:
          'Enclosed box shape, used for general cargo and furniture.',
        created_by: 1,
      },
      {
        name: 'Refrigerated Truck (Reefer)',
        description:
          'Equipped with cooling units, used for transporting perishable goods.',
        created_by: 1,
      },
      {
        name: 'Tanker Truck',
        description:
          'Cylindrical container, used for transporting liquids like fuel, chemicals, or milk.',
        created_by: 1,
      },
      {
        name: 'Dump Truck',
        description:
          'Used for transporting loose materials like sand, gravel, and demolition debris.',
        created_by: 1,
      },
      {
        name: 'Car Carrier Truck',
        description: 'Designed to transport multiple vehicles.',
        created_by: 1,
      },
      {
        name: 'Dry Van',
        description:
          'Fully enclosed, used for shipping non-perishable goods and general freight.',
        created_by: 1,
      },
    ];

    const loadTypes = [
      {
        name: 'Heavy Machinery',
        description: 'construction equipment, industrial tools',
        created_by: 1,
      },
      {
        name: 'Building Materials',
        description: 'steel, lumber, concrete',
        created_by: 1,
      },
      {
        name: 'Oversized Cargo',
        description: 'large pipes, wind turbine parts',
        created_by: 1,
      },
      {
        name: 'General Freight',
        description: 'consumer goods, electronics',
        created_by: 1,
      },
      {
        name: 'Refrigerated Goods',
        description: 'meat, dairy, frozen foods',
        created_by: 1,
      },
      {
        name: 'Pharmaceuticals',
        description: 'temperature-sensitive medications',
        created_by: 1,
      },
      {
        name: 'Perishable Produce',
        description: 'fruits, vegetables, flowers',
        created_by: 1,
      },
      {
        name: 'Liquid Fuels',
        description: 'gasoline, diesel',
        created_by: 1,
      },
      {
        name: 'Chemicals',
        description: 'industrial liquids, hazardous materials',
        created_by: 1,
      },
      {
        name: 'Construction Debris',
        description: 'rubble, waste materials',
        created_by: 1,
      },
      {
        name: 'Passenger Vehicles',
        description: 'cars, SUVs',
        created_by: 1,
      },
      {
        name: 'Dry Goods',
        description: 'textiles, electronics, packaged foods',
        created_by: 1,
      },
    ];

    const mappings = [
      {
        vehicle: 'Flatbed Truck',
        loads: ['Heavy Machinery', 'Building Materials', 'Oversized Cargo'],
      },
      {
        vehicle: 'Box Truck (Cargo Truck / Van)',
        loads: ['General Freight', 'Furniture and Appliances'],
      },
      {
        vehicle: 'Refrigerated Truck (Reefer)',
        loads: ['Refrigerated Goods', 'Pharmaceuticals', 'Perishable Produce'],
      },
      { vehicle: 'Tanker Truck', loads: ['Liquid Fuels', 'Chemicals'] },
      {
        vehicle: 'Dump Truck',
        loads: ['Construction Debris', 'Soil and Earth'],
      },
      { vehicle: 'Car Carrier Truck', loads: ['Passenger Vehicles'] },
      { vehicle: 'Dry Van', loads: ['Dry Goods', 'Non-Perishable Freight'] },
    ];

    const existingVehicleTypes = await vehicleTypeRepo.find();

    if (!existingVehicleTypes.length) {
      // Insert vehicle types
      for (const vehicle of vehicleTypes) {
        const existing = await vehicleTypeRepo.findOneBy({
          name: vehicle.name,
        });
        if (!existing) {
          await vehicleTypeRepo.save(vehicle);
        }
      }

      // Insert load types
      for (const load of loadTypes) {
        const existing = await loadTypeRepo.findOneBy({ name: load.name });
        if (!existing) {
          await loadTypeRepo.save(load);
        }
      }

      // Insert mappings
      for (const mapping of mappings) {
        const vehicleType = await vehicleTypeRepo.findOneBy({
          name: mapping.vehicle,
        });

        for (const loadName of mapping.loads) {
          const loadType = await loadTypeRepo.findOneBy({ name: loadName });

          const existingMapping = await mappingRepo.findOne({
            where: {
              vehicle_type: { id: vehicleType?.id },
              load_type: { id: loadType?.id },
            },
          });

          if (!existingMapping) {
            await mappingRepo.save({
              vehicle_type: vehicleType,
              load_type: loadType,
              rate_per_mile: Math.floor(Math.random() * (80 - 20 + 1)) + 20,
            });
          }
        }
      }

      console.log('Database seeding complete!');
    } else {
      console.log('Data already seeded!');
    }
  }
}
