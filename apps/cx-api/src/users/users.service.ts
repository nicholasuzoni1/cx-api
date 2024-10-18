import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyCreatedUserDto } from './dto/verify-created-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserSessionEntity } from 'apps/cx-api/entities/user-session.entity';
import { RoleEntity } from 'apps/cx-api/entities/role.entity';
import { OtpEntity } from 'apps/cx-api/entities/otp.entity';
import {
  AlreadyExistsErrorHttp,
  NotFoundErrorHttp,
} from '@app/shared-lib/http-errors';
import { LangKeys } from '@app/lang-lib/lang-keys';
import { generateOTP } from '@app/shared-lib/generate-otp';
import * as bcrypt from 'bcrypt';
import moment from 'moment';
import { DEFAULT_OTP, SALT_ROUND } from '@app/shared-lib/constants/config';
import { All_User_Types } from '@app/permission-management/users';
import { OTP_TYPE_ENUM } from '@app/shared-lib/enums/otp-type';
import { UserResponseEntity } from './entities/user.response';
import { CreateUserAdditionalData } from './additionals/create-user';
import { UpdateUserAdditionalData } from './additionals/update-user';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(UserSessionEntity)
    private readonly userSessionEntity: Repository<UserSessionEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>,
    @InjectRepository(OtpEntity)
    private readonly otpEntity: Repository<OtpEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // async create(input: CreateUserDto, additionalData: CreateUserAdditionalData) {
  //   try {
  //     const data = CreateUserConverter.toGrpc(input, additionalData);
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.createUser(data),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = CreateUserConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async create(input: CreateUserDto, additionalData: CreateUserAdditionalData) {
    let queryRunner: QueryRunner | null = null;
    try {
      const user = await this.userEntity.findOne({
        where: {
          email: input.email,
        },
      });

      if (user) {
        throw new AlreadyExistsErrorHttp(LangKeys.AccountAlreadyExistsKey);
      }

      const role = await this.roleEntity.findOne({
        where: {
          id: input.roleId,
          associated_to: additionalData.associatedTo,
        },
      });

      if (!role) {
        throw new NotFoundErrorHttp(LangKeys.RoleNotFoundErrorKey);
      }

      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      let password = generateOTP();

      const salt = await bcrypt.genSalt(SALT_ROUND);
      // now we set user password to hashed password
      password = await bcrypt.hash(password, salt);

      const newUser = this.userEntity.create({
        name: input.name,
        contact_no: input.contactNo,
        email: input.email,
        password: password,
        user_type: All_User_Types.subuser,
        role_id: input.roleId,
        created_by: additionalData.createdBy,
        associated_to: additionalData.associatedTo,
      });

      const savedUser = await queryRunner.manager.save(newUser);

      // use email as hash for test mode
      let hash = savedUser.email;
      let otpCode = DEFAULT_OTP;

      // console.log('ENV TYPE >> ', process.env.APP_ENV);

      if (process.env.APP_ENV != 'local') {
        const salt = await bcrypt.genSalt(SALT_ROUND);
        // now we set user password to hashed password
        hash = await bcrypt.hash(
          JSON.stringify({
            email: savedUser.email,
            createdAt: moment().utc().toDate(),
          }),
          salt,
        );

        // Generate otp for verification
        otpCode = generateOTP();
      }
      const newOtp = this.otpEntity.create({
        code: otpCode,
        user_id: savedUser.id,
        hash: hash,
        expires_at: moment().add(1, 'month').utc().toDate(),
        type: OTP_TYPE_ENUM.USER_VERIFY,
      });

      await queryRunner.manager.save(newOtp);

      // Todo: send account verification mail
      // Using hash and code

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = new UserResponseEntity();

      output.id = savedUser.id;
      output.name = savedUser.name;
      output.contactNo = savedUser.contact_no;
      output.email = savedUser.email;
      output.userType = savedUser.user_type;
      output.associatedTo = savedUser.associated_to;
      output.isVerified = savedUser.is_verified;
      output.roleId = savedUser.role_id;
      output.createdBy = savedUser.created_by;
      output.createdAt = savedUser.created_at.toISOString();
      output.updatedAt = savedUser.updated_at.toISOString();
      output.deletedAt = savedUser.deleted_at?.toISOString();

      return output;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }

  // async verify(input: VerifyCreatedUserDto) {
  //   try {
  //     const data = VerifyCreatedUserConverter.toGrpc(input);
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.verifyCreatedUser(data),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = {};
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async verify(input: VerifyCreatedUserDto) {
    let queryRunner: QueryRunner | null = null;
    try {
      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      const otp = await this.otpEntity.findOne({
        where: {
          hash: input.hash,
          code: input.code,
        },
      });
      if (!otp) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      await queryRunner.manager.softDelete(OtpEntity, {
        user_id: otp.user_id,
        type: OTP_TYPE_ENUM.USER_VERIFY,
      });

      const salt = await bcrypt.genSalt(SALT_ROUND);
      // now we set user password to hashed password
      const newPassword = await bcrypt.hash(input.password, salt);

      await queryRunner.manager.update(
        UserEntity,
        {
          id: otp.user_id,
        },
        {
          is_verified: true,
          password: newPassword,
        },
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = {};
      return output;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }

  // async update(input: UpdateUserDto, additionalData: UpdateUserAdditionalData) {
  //   try {
  //     const data = UpdateUserConverter.toGrpc(input, additionalData);
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.updateUser(data),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = UpdateUserConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async update(input: UpdateUserDto, additionalData: UpdateUserAdditionalData) {
    try {
      const user = await this.userEntity.findOne({
        where: {
          id: input.id,
          associated_to: additionalData.associatedTo,
        },
      });

      if (!user) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      if (input.name) user.name = input.name;
      if (input.contactNo) user.contact_no = input.contactNo;
      if (input.roleId) {
        const role = this.roleEntity.findOne({
          where: {
            id: input.roleId,
            associated_to: additionalData.associatedTo,
          },
        });
        if (!role) {
          throw new NotFoundErrorHttp(LangKeys.RoleNotFoundErrorKey);
        }
        user.role_id = input.roleId;
      }

      await this.userEntity.save(user);

      const output = new UserResponseEntity();

      output.id = user.id;
      output.name = user.name;
      output.contactNo = user.contact_no;
      output.email = user.email;
      output.userType = user.user_type;
      output.associatedTo = user.associated_to;
      output.isVerified = user.is_verified;
      output.roleId = user.role_id;
      output.createdBy = user.created_by;
      output.createdAt = user.created_at.toISOString();
      output.updatedAt = user.updated_at.toISOString();
      output.deletedAt = user.deleted_at?.toISOString();

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async get(id: number, associatedTo: number) {
  //   try {
  //     const res = await lastValueFrom(
  //       this.authServiceClient.getUser({
  //         id: id,
  //         associatedTo: associatedTo,
  //       }),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = CreateUserConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async get(id: number, associatedTo: number) {
    try {
      const user = await this.userEntity.findOne({
        where: {
          id: id,
          associated_to: associatedTo,
        },
      });

      if (!user) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      const output = new UserResponseEntity();

      output.id = user.id;
      output.name = user.name;
      output.contactNo = user.contact_no;
      output.email = user.email;
      output.userType = user.user_type;
      output.associatedTo = user.associated_to;
      output.isVerified = user.is_verified;
      output.roleId = user.role_id;
      output.createdBy = user.created_by;
      output.createdAt = user.created_at.toISOString();
      output.updatedAt = user.updated_at.toISOString();
      output.deletedAt = user.deleted_at?.toISOString();

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async list(associatedTo: number) {
  //   try {
  //     const res = await lastValueFrom(
  //       this.authServiceClient.listUser({
  //         associatedTo: associatedTo,
  //       }),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = ListUserConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async list(associatedTo: number) {
    try {
      const users = await this.userEntity.find({
        where: {
          associated_to: associatedTo,
        },
      });

      const output = users.map((u) => {
        const _user = new UserResponseEntity();

        _user.id = u.id;
        _user.name = u.name;
        _user.contactNo = u.contact_no;
        _user.email = u.email;
        _user.userType = u.user_type;
        _user.associatedTo = u.associated_to;
        _user.isVerified = u.is_verified;
        _user.roleId = u.role_id;
        _user.createdBy = u.created_by;
        _user.createdAt = u.created_at.toISOString();
        _user.updatedAt = u.updated_at.toISOString();
        _user.deletedAt = u.deleted_at?.toISOString();

        return _user;
      });

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async delete(id: number, associatedTo: number) {
  //   try {
  //     const res = await lastValueFrom(
  //       this.authServiceClient.deleteUser({
  //         id: id,
  //         associatedTo: associatedTo,
  //       }),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = {};
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async delete(id: number, associatedTo: number) {
    let queryRunner: QueryRunner | null = null;
    try {
      const user = await this.userEntity.findOne({
        where: {
          id: id,
          associated_to: associatedTo,
        },
      });

      if (!user) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      await queryRunner.manager.softDelete(UserEntity, {
        id: user.id,
      });

      await queryRunner.manager.softDelete(UserSessionEntity, {
        user_id: user.id,
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = {};

      return output;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }
}
