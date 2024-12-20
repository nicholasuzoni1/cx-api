import { LangKeys } from '@app/lang-lib/lang-keys';
import { UserTokenPayloadType } from '@app/permission-management';
import { Primary_User_Types } from '@app/permission-management/users';
import { ForbiddenErrorHttp } from '@app/shared-lib/http-errors';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Permission_Scope_Names } from '@app/permission-management/permission-scopes';
import { PermissionDecoratorType } from '@app/shared-lib/decorators/permissions.decorator';

@Injectable()
export class ShipperGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Retrieve optional permissions metadata

    const permissionInfo = this.reflector.get<PermissionDecoratorType>(
      'permissions',
      context.getHandler(),
    );

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as UserTokenPayloadType;

    if (user && user.userType == Primary_User_Types.shipper) {
      return true;
    }

    if (user.scope != Primary_User_Types.shipper) {
      throw new ForbiddenErrorHttp(LangKeys.AccessPermissionNotFound);
    }
    // If permission metadata is not present, allow access
    if (!permissionInfo || !permissionInfo.module || !permissionInfo.key) {
      return true;
    }

    // If user or permissions are missing, deny access
    if (!user || !user.permissions) {
      throw new ForbiddenErrorHttp(LangKeys.AccessPermissionNotFound);
    }

    const requiredModule = permissionInfo.module;

    const requiredKey = permissionInfo.key;

    const hasPermission = user.permissions.some((permission) => {
      const scopeMatch = Permission_Scope_Names.shipper === permission.scope;

      const moduleMatch =
        requiredModule && permission.module === requiredModule;

      const keyMatch = requiredKey && permission.key === requiredKey;

      return scopeMatch && moduleMatch && keyMatch;
    });

    if (!hasPermission) {
      throw new ForbiddenErrorHttp(LangKeys.AccessPermissionNotFound);
    }
    return true;
  }
}
