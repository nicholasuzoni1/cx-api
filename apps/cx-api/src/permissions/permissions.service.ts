import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreatePermissionAdditionalData } from './converters/create-permission';
import { Permission_Scope_List } from '@app/permission-management/permission-scopes';
import {
  AlreadyExistsErrorHttp,
  ForbiddenErrorHttp,
  NotFoundErrorHttp,
} from '@app/shared-lib/http-errors';
import { LangKeys } from '@app/lang-lib/lang-keys';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { DataSource, In, Not, QueryRunner, Raw, Repository } from 'typeorm';
import { PermissionEntity } from 'apps/cx-api/entities/permission.entity';
import { RoleEntity } from 'apps/cx-api/entities/role.entity';
import { Primary_User_Types } from '@app/permission-management/users';
import { PermissionResponseEntity } from './entities/permission.response';
import {
  Permission_Module_Keys,
  Permission_Module_List,
  PermissionModuleKeysType,
} from '@app/permission-management/permission-module-keys';
import { PermissionModuleKeysResponseEntity } from './entities/list-permission-module-keys.response';
import { UserSessionEntity } from 'apps/cx-api/entities/user-session.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionEntity: Repository<PermissionEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // async create(
  //   input: CreatePermissionDto,
  //   additionalData: CreatePermissionAdditionalData,
  // ) {
  //   try {
  //     const data = CreatePermissionConverter.toGrpc(input, additionalData);
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.createPermission(data),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = CreatePermissionConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async create(
    input: CreatePermissionDto,
    additionalData: CreatePermissionAdditionalData,
  ) {
    try {
      const user = await this.userEntity.findOne({
        where: {
          id: additionalData.createdBy,
        },
      });

      if (!user) {
        throw new NotFoundErrorHttp(LangKeys.AccountNotFoundErrorKey);
      }
      if (user && user.user_type != Primary_User_Types.admin) {
        let primaryUser: UserEntity | null = null;
        if (user.associated_to) {
          primaryUser = await this.userEntity.findOne({
            where: {
              id: user.associated_to,
            },
          });
        }

        if (primaryUser && primaryUser.user_type != Primary_User_Types.admin) {
          throw new ForbiddenErrorHttp(LangKeys.UnAuthorizedErrorKey);
        }
      }

      const permission = await this.permissionEntity.findOne({
        where: {
          key: input.key,
          module: input.module,
          scope: input.scope,
        },
      });
      if (permission) {
        throw new AlreadyExistsErrorHttp(LangKeys.DuplicatePermissionErrorKey);
      }

      const newPermission = this.permissionEntity.create({
        name: input.name,
        key: input.key,
        module: input.module,
        scope: input.scope,
        created_by: additionalData.createdBy,
      });

      const savedPermission = await this.permissionEntity.save(newPermission);

      const output = new PermissionResponseEntity();

      output.id = savedPermission.id;
      output.name = savedPermission.name;
      output.key = savedPermission.key;
      output.module = savedPermission.module;
      output.scope = savedPermission.scope;
      output.createdBy = savedPermission.created_by;
      output.createdAt = savedPermission.created_at.toISOString();
      output.updatedAt = savedPermission.updated_at.toISOString();
      output.deletedAt = savedPermission.deleted_at?.toISOString();

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async update(input: UpdatePermissionDto) {
  //   try {
  //     const data = UpdatePermissionConverter.toGrpc(input);
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.updatePermission(data),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = UpdatePermissionConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async update(input: UpdatePermissionDto) {
    let queryRunner: QueryRunner | null = null;
    try {
      const permission = await this.permissionEntity.findOne({
        where: {
          id: input.id,
        },
      });
      if (!permission) {
        throw new NotFoundErrorHttp(LangKeys.PermissionNotFoundErrorKey);
      }

      permission.name = input.name;
      permission.key = input.key;
      permission.module = input.module;
      permission.scope = input.scope;

      const duplicatePermission = await this.permissionEntity.findOne({
        where: {
          key: permission.key,
          module: permission.module,
          scope: permission.scope,
          id: Not(permission.id),
        },
      });

      if (duplicatePermission) {
        throw new AlreadyExistsErrorHttp(LangKeys.DuplicatePermissionErrorKey);
      }

      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      await queryRunner.manager.save(permission);

      const roles = await queryRunner.manager.find(RoleEntity, {
        where: {
          permissions: Raw((alias) => `${input.id} = ANY(${alias})`),
        },
      });

      const users = await queryRunner.manager.find(UserEntity, {
        where: {
          role_id: In(roles.map((r) => r.id)),
        },
      });

      await queryRunner.manager.softDelete(UserSessionEntity, {
        user_id: In(users.map((u) => u.id)),
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const output = new PermissionResponseEntity();
      output.id = permission.id;
      output.name = permission.name;
      output.key = permission.key;
      output.module = permission.module;
      output.scope = permission.scope;
      output.createdBy = permission.created_by;
      output.createdAt = permission.created_at.toISOString();
      output.updatedAt = permission.updated_at.toISOString();
      output.deletedAt = permission.deleted_at?.toISOString();

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async get(id: number) {
  //   try {
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.getPermission({ id: id }),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = GetPermissionConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async get(id: number) {
    try {
      const permission = await this.permissionEntity.findOne({
        where: {
          id: id,
        },
      });
      if (!permission) {
        throw new NotFoundErrorHttp(LangKeys.PermissionNotFoundErrorKey);
      }

      const output = new PermissionResponseEntity();
      output.id = permission.id;
      output.name = permission.name;
      output.key = permission.key;
      output.module = permission.module;
      output.scope = permission.scope;
      output.createdBy = permission.created_by;
      output.createdAt = permission.created_at.toISOString();
      output.updatedAt = permission.updated_at.toISOString();
      output.deletedAt = permission.deleted_at?.toISOString();

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async list(scope?: string) {
  //   try {
  //     if (scope && !Permission_Scope_Names[scope]) {
  //       const err: HttpErrorType = {
  //         errorMessageKey: LangKeys.InvalideScopeValueErrorKey,
  //         realError: '',
  //       };
  //       throw new BadRequestException(err);
  //     }

  //     const res = await lastValueFrom(
  //       await this.authServiceClient.listPermission({
  //         scope: scope,
  //       }),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = ListPermissionConverter.fromGrpc(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async list(scope?: string) {
    try {
      const permissions = await this.permissionEntity.find({
        where: {
          scope: scope,
        },
      });

      const output = permissions.map((p) => {
        const per = new PermissionResponseEntity();
        per.id = p.id;
        per.name = p.name;
        per.key = p.key;
        per.module = p.module;
        per.scope = p.scope;
        per.createdBy = p.created_by;
        per.createdAt = p.created_at.toISOString();
        per.updatedAt = p.updated_at.toISOString();
        per.deletedAt = p.deleted_at?.toISOString();
        return per;
      });

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async listModuleKeys() {
  //   try {
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.listPermissionModuleKeys({}),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     // eslint-disable-next-line prettier/prettier
  //     const output = ListPermissionModuleKeysConverter.from(res.data);
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async listModuleKeys() {
    try {
      const permissionKeys = Object.keys(Permission_Module_Keys).reduce(
        (obj, module) => ({
          ...obj,
          [module]: { keys: Permission_Module_Keys[module] },
        }),
        {},
      );

      const output = new PermissionModuleKeysResponseEntity();
      const moduleKeys: PermissionModuleKeysType = Object.keys(
        permissionKeys,
      ).reduce(
        (obj, module) => ({
          ...obj,
          [module]: permissionKeys[module].keys,
        }),
        {},
      );
      output.moduleKeys = moduleKeys;

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async listModules() {
  //   try {
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.listPermissionModules({}),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = res.data.modules ? res.data.modules : [];
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async listModules() {
    try {
      const output = Permission_Module_List as string[];
      return output;
    } catch (error) {
      throw error;
    }
  }

  // async listScopes() {
  //   try {
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.listPermissionScopes({}),
  //     );

  //     if (res.error) {
  //       throw grpcErrorConverter(res.error as any);
  //     }
  //     const output = res.data.scopes ? res.data.scopes : [];
  //     return output;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async listScopes() {
    try {
      const output = Permission_Scope_List as string[];

      return output;
    } catch (error) {
      throw error;
    }
  }

  // async delete(id: number) {
  //   try {
  //     const res = await lastValueFrom(
  //       await this.authServiceClient.deletePermission({
  //         id: id,
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

  async delete(id: number) {
    let queryRunner: QueryRunner | null = null;
    try {
      const permission = await this.permissionEntity.findOne({
        where: {
          id: id,
        },
      });
      if (!permission) {
        throw new NotFoundErrorHttp(LangKeys.PermissionNotFoundErrorKey);
      }

      queryRunner = this.dataSource.createQueryRunner();

      // Establish a real database connection
      await queryRunner.connect();

      // Start a transaction
      await queryRunner.startTransaction();

      await queryRunner.manager.softRemove(permission);

      const roles = await queryRunner.manager.find(RoleEntity, {
        where: {
          permissions: Raw((alias) => `${id} = ANY(${alias})`),
        },
      });

      const updatedRoles = roles.map((role) => {
        role.permissions = role.permissions.filter((p) => p != id);
        return role;
      });

      await queryRunner.manager.save(updatedRoles);

      const users = await queryRunner.manager.find(UserEntity, {
        where: {
          role_id: In(roles.map((r) => r.id)),
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
