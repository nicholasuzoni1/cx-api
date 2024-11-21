import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { VehicleLoadTypeEntity } from './vehicle-load-type.entity';
import { LoadDetailsEntity } from './load-details.entity';

@Entity('vehicle_types')
export class VehicleTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  status?: Boolean;

  @Column()
  created_by?: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date | null;

  // Relations
  @OneToMany(
    () => VehicleLoadTypeEntity,
    (vehicleLoadType) => vehicleLoadType.vehicle_type,
  )
  vehicleLoadTypes: VehicleLoadTypeEntity[];

  @OneToMany(() => LoadDetailsEntity, (loadDetail) => loadDetail.vehicle_type)
  loadDetail: LoadDetailsEntity;
}
