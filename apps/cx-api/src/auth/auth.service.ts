import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendForgotPasswordOtpDto } from './dto/resend-forgot-password-otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { VerifyResetPasswordOtpDto } from './dto/verify-reset-password-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { UserSessionEntity } from 'apps/cx-api/entities/user-session.entity';
import { RoleEntity } from 'apps/cx-api/entities/role.entity';
import { PermissionEntity } from 'apps/cx-api/entities/permission.entity';
import { OtpEntity } from 'apps/cx-api/entities/otp.entity';
import {
  DataSource,
  In,
  MoreThan,
  Not,
  QueryRunner,
  Repository,
} from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  AlreadyExistsErrorHttp,
  BadRequestErrorHttp,
  NotFoundErrorHttp,
} from '@app/shared-lib/http-errors';
import { LangKeys } from '@app/lang-lib/lang-keys';
import moment from 'moment';
import * as bcrypt from 'bcrypt';
import { DEFAULT_OTP, SALT_ROUND } from '@app/shared-lib/constants/config';
import { generateOTP } from '@app/shared-lib/generate-otp';
import { SignupResponseEntity } from './entities/signup-response';
import { VerifyUserResponseEntity } from './entities/verify-user-response';
import {
  UserTokenPayloadType,
  UserTokenPermissionType,
} from '@app/permission-management';
import { SigninResponseEntity } from './entities/signin-response';
import { UserResponseEntity } from './entities/user-response';
import { PermissionResponseEntity } from '../permissions/entities/permission.response';
import { ForgotPasswordResponseEntity } from './entities/forgot-password-response';
import { VerifyResetPasswordOtpResponseEntity } from './entities/verify-reset-password-otp-response';
import { ResetPasswordResponseEntity } from './entities/reset-password-response';
import { ResendForgotPasswordOtpResponseEntity } from './entities/resend-forgot-password-otp-response';
import { UpdatePasswordResponseEntity } from './entities/update-password-response';
import { OTP_TYPE_ENUM } from '@app/shared-lib/enums/otp-type';
import { UpdatePasswordAdditionalData } from './additionals/update-password';
import { MailClientService } from '../mail-client/mail-client.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(UserSessionEntity)
    private readonly userSessionEntity: Repository<UserSessionEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionEntity: Repository<PermissionEntity>,
    @InjectRepository(OtpEntity)
    private readonly otpEntity: Repository<OtpEntity>,
    private jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly mailClientService: MailClientService,
  ) {}

  async signup(input: SignupDto) {
    let queryRunner: QueryRunner | null = null;
    try {
      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      let userAccount = await this.userEntity.findOneBy({
        email: input.email,
      });

      if (userAccount && userAccount.is_verified) {
        throw new AlreadyExistsErrorHttp(LangKeys.AccountAlreadyExistsKey);
      }

      if (!userAccount) {
        if (input.password) {
          const salt = await bcrypt.genSalt(SALT_ROUND);
          // now we set user password to hashed password
          const newPassword = await bcrypt.hash(input.password, salt);
          input.password = newPassword;
        }

        const newUser = this.userEntity.create({
          name: input.name,
          contact_no: input.contactNo,
          email: input.email,
          password: input.password,
          user_type: input.userType,
        });

        userAccount = await queryRunner.manager.save(newUser);
      } else if (userAccount && !userAccount.is_verified) {
        await queryRunner.manager.softDelete(OtpEntity, {
          user_id: userAccount.id,
          type: OTP_TYPE_ENUM.USER_VERIFY,
        });
      }

      // use email as hash for test mode
      let hash = userAccount.email;
      let otpCode = DEFAULT_OTP;

      // console.log('ENV TYPE >> ', process.env.APP_ENV);

      if (process.env.APP_ENV != 'local') {
        const salt = await bcrypt.genSalt(SALT_ROUND);
        // now we set user password to hashed password
        hash = await bcrypt.hash(
          JSON.stringify({
            email: userAccount.email,
            createdAt: moment().utc().toDate(),
          }),
          salt,
        );

        // Generate otp for verification
        otpCode = generateOTP();
      }
      const newOtp = this.otpEntity.create({
        code: otpCode,
        user_id: userAccount.id,
        hash: hash,
        expires_at: moment().add(1, 'month').utc().toDate(),
        type: OTP_TYPE_ENUM.USER_VERIFY,
      });

      await queryRunner.manager.save(newOtp);

      // Todo: send account verification mail
      // Using hash and code
      // Create a verification link with hash and code
      const verificationLink = `${process.env.FRONTEND_HOST}/auth/verify-user?hash=${hash}&code=${otpCode}`;
      // console.log('Verification_Link', verificationLink);

      // Send verification email with the link
      await this.mailClientService.sendMail(
        userAccount.email,
        'Verify Your Account',
        'Please verify your account',
        `<strong>Please verify your account by clicking the following link:</strong><br /><a href="${verificationLink}">Verify Account</a>`,
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = new SignupResponseEntity();
      return output;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }

  async verifyUser(input: VerifyUserDto) {
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

      await queryRunner.manager.update(
        UserEntity,
        {
          id: otp.user_id,
        },
        {
          is_verified: true,
        },
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = new VerifyUserResponseEntity();
      return output;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }

  async signin(input: SigninDto) {
    try {
      const user = await this.userEntity.findOneBy({
        email: input.email,
        is_verified: true,
      });
      if (!user) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      let tokenScope = '';

      if (user.associated_to) {
        const primaryUser = await this.userEntity.findOneBy({
          id: user.associated_to,
        });
        tokenScope = primaryUser?.user_type;
      } else {
        tokenScope = user.user_type;
      }

      const isPasswordMatching = await bcrypt.compare(
        input.password,
        user.password,
      );

      if (!isPasswordMatching) {
        throw new BadRequestErrorHttp(LangKeys.InvalidCredentialsErrorKey);
      }

      let permissions: PermissionEntity[] = [];

      let tokenPermissions: UserTokenPermissionType[] = [];

      if (user.role_id) {
        const role = await this.roleEntity.findOne({
          where: {
            id: user.role_id,
          },
        });

        if (role) {
          permissions = await this.permissionEntity.find({
            where: {
              id: In(role.permissions),
            },
          });
        }

        tokenPermissions = permissions.map((p) => {
          return {
            scope: p.scope,
            module: p.module,
            key: p.key,
          };
        });
      }

      const tokenData: UserTokenPayloadType = {
        id: user.id,
        email: user.email,
        userType: user.user_type,
        permissions: tokenPermissions,
        associatedTo: user.associated_to,
        createdBy: user.created_by,
        scope: tokenScope,
      };

      const accessToken = this.jwtService.sign(tokenData);

      const newSession = await this.userSessionEntity.create({
        user_id: user.id,
        token: accessToken,
        expires_at: moment().add(3, 'days').utc().toDate(),
      });

      await this.userSessionEntity.save(newSession);

      const output = new SigninResponseEntity();

      output.accessToken = accessToken;
      const _user = new UserResponseEntity();
      _user.id = user.id;
      _user.name = user.name;
      _user.contactNo = user.contact_no;
      _user.email = user.email;
      _user.userType = user.user_type;
      _user.associatedTo = user.associated_to;
      _user.isVerified = user.is_verified;
      _user.roleId = user.role_id;
      _user.createdBy = user.created_by;
      // oUser.createdAt = user.created_at.toISOString();
      // oUser.updatedAt = user.updated_at.toISOString();
      // oUser.deletedAt = user.deleted_at?.toISOString();

      output.user = _user;
      output.scope = tokenScope;
      output.permissions = permissions.map((p) => {
        const output = new PermissionResponseEntity();

        output.id = p.id;
        output.name = p.name;
        output.key = p.key;
        output.module = p.module;
        output.scope = p.scope;
        // output.createdBy = p.createdBy;
        // output.createdAt = p.createdAt;
        // output.updatedAt = p.updatedAt;
        // output.deletedAt = p.deletedAt;

        return output;
      });

      return output;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(input: ForgotPasswordDto) {
    let queryRunner: QueryRunner | null = null;
    try {
      const userAccount = await this.userEntity.findOneBy({
        email: input.email,
        is_verified: true,
      });

      if (!userAccount) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }
      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      await queryRunner.manager.softDelete(OtpEntity, {
        user_id: userAccount.id,
        type: OTP_TYPE_ENUM.FORGOT_PASSWORD,
      });

      // use email as hash for test mode
      let hash = userAccount.email;
      let otpCode = DEFAULT_OTP;

      // console.log('ENV TYPE >> ', process.env.APP_ENV);

      if (process.env.APP_ENV != 'local') {
        const salt = await bcrypt.genSalt(SALT_ROUND);
        // now we set user password to hashed password
        hash = await bcrypt.hash(
          JSON.stringify({
            email: userAccount.email,
            createdAt: moment().utc().toDate(),
          }),
          salt,
        );

        // Generate otp for verification
        otpCode = generateOTP();
      }
      const newOtp = this.otpEntity.create({
        code: otpCode,
        user_id: userAccount.id,
        hash: hash,
        expires_at: moment().add(1, 'days').utc().toDate(),
        type: OTP_TYPE_ENUM.FORGOT_PASSWORD,
      });

      await queryRunner.manager.save(newOtp);

      // Todo: send forgot password mail
      // Using hash and code
      console.log('Forgot_Password_Mail_Content', userAccount.email, otpCode);
      await this.mailClientService.sendMail(
        userAccount.email,
        'Password Reset OTP',
        'Here is your OTP for password reset',
        `<strong>Your OTP for password reset is:</strong> ${otpCode}`,
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = new ForgotPasswordResponseEntity();
      output.hash = hash;

      return output;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }

  async verifyResetPasswordOtp(input: VerifyResetPasswordOtpDto) {
    let queryRunner: QueryRunner | null = null;
    try {
      const otp = await this.otpEntity.findOneBy({
        hash: input.hash,
        code: input.code,
        expires_at: MoreThan(moment().utc().toDate()),
      });

      if (!otp) {
        throw new NotFoundErrorHttp(LangKeys.OtpNotFoundErrorKey);
      }

      const userAccount = await this.userEntity.findOneBy({
        id: otp.user_id,
        is_verified: true,
      });

      if (!userAccount) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }
      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      await queryRunner.manager.softDelete(OtpEntity, {
        user_id: otp.id,
        type: In([OTP_TYPE_ENUM.FORGOT_PASSWORD, OTP_TYPE_ENUM.RESET_PASSWORD]),
      });

      // use email as hash for test mode
      let hash = userAccount.email;
      let otpCode = DEFAULT_OTP;

      // console.log('ENV TYPE >> ', process.env.APP_ENV);

      if (process.env.APP_ENV != 'local') {
        const salt = await bcrypt.genSalt(SALT_ROUND);
        // now we set user password to hashed password
        hash = await bcrypt.hash(
          JSON.stringify({
            email: userAccount.email,
            createdAt: moment().utc().toDate(),
          }),
          salt,
        );

        // Generate otp for verification
        otpCode = generateOTP();
      }
      const newOtp = this.otpEntity.create({
        code: otpCode,
        user_id: userAccount.id,
        hash: hash,
        expires_at: moment().add(1, 'days').utc().toDate(),
        type: OTP_TYPE_ENUM.RESET_PASSWORD,
      });

      await queryRunner.manager.save(newOtp);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = new VerifyResetPasswordOtpResponseEntity();
      output.hash = newOtp.hash;

      return output;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }

  async resetPassword(input: ResetPasswordDto) {
    let queryRunner: QueryRunner | null = null;
    try {
      const otp = await this.otpEntity.findOneBy({
        hash: input.hash,
        expires_at: MoreThan(moment().utc().toDate()),
      });

      if (!otp) {
        throw new NotFoundErrorHttp(LangKeys.SessionExpiresErrorKey);
      }
      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      await queryRunner.manager.softDelete(OtpEntity, {
        user_id: otp.user_id,
        type: In([OTP_TYPE_ENUM.FORGOT_PASSWORD, OTP_TYPE_ENUM.RESET_PASSWORD]),
      });

      await queryRunner.manager.softDelete(UserSessionEntity, {
        user_id: otp.user_id,
      });

      const salt = await bcrypt.genSalt(SALT_ROUND);
      // now we set user password to hashed password
      const newPassword = (await bcrypt.hash(input.password, salt)) as string;

      await queryRunner.manager.update(
        UserEntity,
        { id: otp.user_id },
        { password: newPassword },
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = new ResetPasswordResponseEntity();

      return output;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }

  async resendForgotPasswordOtp(input: ResendForgotPasswordOtpDto) {
    let queryRunner: QueryRunner | null = null;
    try {
      const otp = await this.otpEntity.findOneBy({
        hash: input.hash,
      });

      if (!otp) {
        throw new NotFoundErrorHttp(LangKeys.OtpNotFoundErrorKey);
      }

      const userAccount = await this.userEntity.findOneBy({
        id: otp.user_id,
        is_verified: true,
      });

      if (!userAccount) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      await queryRunner.manager.softDelete(OtpEntity, {
        user_id: otp.user_id,
        type: OTP_TYPE_ENUM.FORGOT_PASSWORD,
      });

      // use email as hash for test mode
      let hash = userAccount.email;
      let otpCode = DEFAULT_OTP;

      // console.log('ENV TYPE >> ', process.env.APP_ENV);

      if (process.env.APP_ENV != 'local') {
        const salt = await bcrypt.genSalt(SALT_ROUND);
        // now we set user password to hashed password
        hash = await bcrypt.hash(
          JSON.stringify({
            email: userAccount.email,
            createdAt: moment().utc().toDate(),
          }),
          salt,
        );

        // Generate otp for verification
        otpCode = generateOTP();
      }
      const newOtp = this.otpEntity.create({
        code: otpCode,
        user_id: userAccount.id,
        hash: hash,
        expires_at: moment().add(1, 'days').utc().toDate(),
        type: OTP_TYPE_ENUM.FORGOT_PASSWORD,
      });

      await queryRunner.manager.save(newOtp);

      // Todo: send forgot password mail
      // Using hash and code

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = new ResendForgotPasswordOtpResponseEntity();
      output.hash = hash;

      return output;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }

  async updatePassword(
    input: UpdatePasswordDto,
    addtionalData: UpdatePasswordAdditionalData,
  ) {
    let queryRunner: QueryRunner | null = null;
    try {
      const user = await this.userEntity.findOneBy({
        id: addtionalData.userId,
      });

      if (!user) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      const isPasswordMatching = await bcrypt.compare(
        input.oldPassword,
        user.password,
      );

      if (!isPasswordMatching) {
        throw new BadRequestErrorHttp(LangKeys.InvalidOldPasswordErrorKey);
      }
      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      await queryRunner.manager.softDelete(UserSessionEntity, {
        user_id: user.id,
        token: Not(addtionalData.session ? addtionalData.session : ''),
      });

      const salt = await bcrypt.genSalt(SALT_ROUND);
      // now we set user password to hashed password
      const newPassword = (await bcrypt.hash(
        input.newPassword,
        salt,
      )) as string;

      await queryRunner.manager.update(
        UserEntity,
        { id: user.id },
        { password: newPassword },
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = new UpdatePasswordResponseEntity();

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
