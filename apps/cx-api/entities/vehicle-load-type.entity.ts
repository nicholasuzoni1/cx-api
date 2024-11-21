import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { VehicleTypeEntity } from './vehicle-type.entity';
import { LoadTypeEntity } from './load-type.entity';

@Entity('vehicle_load_types')
export class VehicleLoadTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleTypeId?: number;

  @Column()
  loadTypeId?: number;

  @ManyToOne(
    () => VehicleTypeEntity,
    (vehicleType) => vehicleType.vehicleLoadTypes,
  )
  @JoinColumn({ name: 'vehicleTypeId' })
  vehicle_type: VehicleTypeEntity;

  @ManyToOne(() => LoadTypeEntity, (loadType) => loadType.vehicleLoadTypes)
  @JoinColumn({ name: 'loadTypeId' })
  load_type: LoadTypeEntity;

  @Column({ nullable: true })
  rate_per_mile: number;
}
