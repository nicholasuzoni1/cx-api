import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleAdditionalData } from './converters/create-role';
import { UpdateRoleAdditionalData } from './converters/update-role';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';
import { RoleEntity } from 'apps/cx-api/entities/role.entity';
import { PermissionEntity } from 'apps/cx-api/entities/permission.entity';
import { NotFoundErrorHttp } from '@app/shared-lib/http-errors';
import { LangKeys } from '@app/lang-lib/lang-keys';
import { Primary_User_List } from '@app/permission-management/users';
import { RoleResponseEntity } from './entities/role.response';
import { UserSessionEntity } from 'apps/cx-api/entities/user-session.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionEntity: Repository<PermissionEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // async create(input: CreateRoleDto, additionalData: CreateRoleAdditionalData) {
  //   try {
  //     const data = CreateRoleConverter.toGrpc(input, additionalData);
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.createRole(data),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = CreateRoleConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async create(input: CreateRoleDto, additionalData: CreateRoleAdditionalData) {
    try {
      const user = await this.userEntity.findOne({
        where: {
          id: additionalData.createdBy,
        },
      });
      if (!user) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      const primaryUser = await this.userEntity.findOne({
        where: {
          id: additionalData.associatedTo,
          user_type: In(Primary_User_List),
        },
      });
      if (!primaryUser) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      const permissions = await this.permissionEntity.find({
        where: {
          id: In(input.permissions),
          scope: primaryUser.user_type,
        },
      });

      if (permissions.length != input.permissions.length) {
        throw new NotFoundErrorHttp(
          LangKeys.InvalidPermissionsSelectedErrorKey,
        );
      }

      const newRole = this.roleEntity.create({
        name: input.name,
        permissions: permissions.map((p) => p.id),
        associated_to: additionalData.associatedTo,
        created_by: additionalData.createdBy,
      });

      const role = await this.roleEntity.save(newRole);

      const output = new RoleResponseEntity();
      output.id = role.id;
      output.name = role.name;
      output.permissions = role.permissions;
      output.associatedTo = role.associated_to;
      output.createdBy = role.created_by;
      output.createdAt = role.created_at.toISOString();
      output.updatedAt = role.updated_at.toISOString();
      output.deletedAt = role.deleted_at?.toISOString();

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async update(input: UpdateRoleDto, additionalData: UpdateRoleAdditionalData) {
  //   try {
  //     const data = UpdateRoleConverter.toGrpc(input, additionalData);
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.updateRole(data),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = UpdateRoleConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async update(input: UpdateRoleDto, additionalData: UpdateRoleAdditionalData) {
    let queryRunner: QueryRunner | null = null;
    try {
      const primaryUser = await this.userEntity.findOne({
        where: {
          id: additionalData.associatedTo,
          user_type: In(Primary_User_List),
        },
      });
      if (!primaryUser) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }

      const permissions = await this.permissionEntity.find({
        where: {
          id: In(input.permissions),
          scope: primaryUser.user_type,
        },
      });

      if (permissions.length != input.permissions.length) {
        throw new NotFoundErrorHttp(
          LangKeys.InvalidPermissionsSelectedErrorKey,
        );
      }

      const role = await this.roleEntity.findOne({
        where: {
          id: input.id,
        },
      });
      if (!role) {
        throw new NotFoundErrorHttp(LangKeys.RoleNotFoundErrorKey);
      }

      if (input.name) {
        role.name = input.name;
      }
      if (input.permissions) {
        role.permissions = permissions.map((p) => p.id);
      }

      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      await queryRunner.manager.save(role);

      const users = await queryRunner.manager.find(UserEntity, {
        where: {
          role_id: role.id,
        },
      });

      await queryRunner.manager.softDelete(UserSessionEntity, {
        user_id: In(users.map((u) => u.id)),
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = new RoleResponseEntity();
      output.id = role.id;
      output.name = role.name;
      output.permissions = role.permissions;
      output.associatedTo = role.associated_to;
      output.createdBy = role.created_by;
      output.createdAt = role.created_at.toISOString();
      output.updatedAt = role.updated_at.toISOString();
      output.deletedAt = role.deleted_at?.toISOString();

      return output;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }

  // async get(id: number, associatedTo: number) {
  //   try {
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.getRole({
  //         id: id,
  //         associatedTo: associatedTo,
  //       }),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = GetRoleConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async get(id: number, associatedTo: number) {
    try {
      const role = await this.roleEntity.findOne({
        where: {
          id: id,
          associated_to: associatedTo,
        },
      });
      if (!role) {
        throw new NotFoundErrorHttp(LangKeys.RoleNotFoundErrorKey);
      }

      const output = new RoleResponseEntity();
      output.id = role.id;
      output.name = role.name;
      output.permissions = role.permissions;
      output.associatedTo = role.associated_to;
      output.createdBy = role.created_by;
      output.createdAt = role.created_at.toISOString();
      output.updatedAt = role.updated_at.toISOString();
      output.deletedAt = role.deleted_at?.toISOString();

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async list(associatedTo: number) {
  //   try {
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.listRole({
  //         associatedTo: associatedTo,
  //       }),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = ListRoleConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async list(associatedTo: number) {
    try {
      const roles = await this.roleEntity.find({
        where: {
          associated_to: associatedTo,
        },
      });

      const output = roles.map((r) => {
        const _role = new RoleResponseEntity();
        _role.id = r.id;
        _role.name = r.name;
        _role.permissions = r.permissions;
        _role.associatedTo = r.associated_to;
        _role.createdBy = r.created_by;
        _role.createdAt = r.created_at.toISOString();
        _role.updatedAt = r.updated_at.toISOString();
        _role.deletedAt = r.deleted_at?.toISOString();
        return _role;
      });

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async delete(id: number, associatedTo: number) {
  //   try {
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.deleteRole({
  //         id: id,
  //         associatedTo: associatedTo,
  //       }),
  //     );
  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     return {} as object;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async delete(id: number, associatedTo: number) {
    let queryRunner: QueryRunner | null = null;
    try {
      const role = await this.roleEntity.findOne({
        where: {
          id: id,
          associated_to: associatedTo,
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

      await queryRunner.manager.softDelete(RoleEntity, {
        id: role.id,
      });

      const users = await queryRunner.manager.find(UserEntity, {
        where: {
          role_id: role.id,
        },
      });

      await queryRunner.manager.softDelete(UserSessionEntity, {
        user_id: In(users.map((u) => u.id)),
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {} as object;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }
}
