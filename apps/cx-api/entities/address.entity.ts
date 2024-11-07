import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity('addresses')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postal_code: number;

  // @OneToOne(() => ProfileEntity, (profile) => profile.address)
  // @JoinColumn()
  // profile: ProfileEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
