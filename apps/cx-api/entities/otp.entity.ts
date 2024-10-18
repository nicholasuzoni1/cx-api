import { OTP_TYPE_ENUM } from '@app/shared-lib/enums/otp-type';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('otps')
export class OtpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  code: string;

  @Column({
    default: OTP_TYPE_ENUM.FORGOT_PASSWORD,
  })
  type: string;

  @Column()
  hash: string;

  @Column({ default: null, type: 'timestamptz' })
  expires_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
