import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  // @Column({
  //   default: '',
  // })
  // contact_no: string;

  @Column({
    default: '',
  })
  user_type: string;

  @Column({
    default: null,
  })
  role_id: number | null;

  @Column({
    default: null,
  })
  associated_to: number | null;

  @Column({
    default: false,
  })
  is_verified: boolean;

  @Column({
    default: null,
  })
  customer_id: string | null;

  @Column({
    default: null,
  })
  language?: string | null;

  @Column({
    default: null,
  })
  logo: string | null;

  @Column({
    default: null,
  })
  created_by: number | null;

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
