import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('loads')
export class LoadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  load_type: string;

  @Column()
  weight_unit: string;

  @Column()
  weight: number;

  @Column()
  dimension_unit: string;

  @Column('json')
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  @Column()
  vehicle_type: string;

  @Column()
  min_budget: number;

  @Column()
  max_budget: number;

  @Column('json')
  pickup_location: {
    address: string;
    lat: number;
    lng: number;
  };

  @Column({ type: 'timestamptz' })
  pickup_datetime: Date;

  @Column('json')
  destination_location: {
    address: string;
    lat: number;
    lng: number;
  };

  @Column({ type: 'timestamptz' })
  arrival_datetime: Date;

  @Column({
    default: false,
  })
  isPrivate: boolean;

  @Column()
  created_by: number;

  @Column()
  associated_to: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
