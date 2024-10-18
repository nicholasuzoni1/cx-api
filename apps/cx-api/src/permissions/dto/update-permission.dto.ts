import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsString,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  Permission_Scope_List,
  Permission_Scope_Names,
} from '@app/permission-management/permission-scopes';
import { Transform } from 'class-transformer';
import Long from 'long';
import {
  Permission_Module_List,
  Permission_Module_Keys,
  Module_Names,
} from '@app/permission-management/permission-module-keys';
import { CreatePermissionDto } from './create-permission.dto';
import { AccountsModuleKeys } from '@app/permission-management/permission-module-keys/modules/accounts';

@ValidatorConstraint({ name: 'IsKeyValidForModule', async: false })
export class IsKeyValidForModule implements ValidatorConstraintInterface {
  validate(key: string, args: ValidationArguments) {
    const module = (args.object as UpdatePermissionDto).module;
    const validKeys = Permission_Module_Keys[module]; // Map of keys per module
    return validKeys && validKeys.includes(key);
  }

  defaultMessage(args: ValidationArguments) {
    const module = (args.object as CreatePermissionDto).module;
    return `Key must be one of the following for module '${module}': ${Permission_Module_Keys[module].join(', ')}`;
  }
}

export class UpdatePermissionDto {
  @IsNotEmpty()
  @Transform(({ value }) => (Long.isLong(value) ? value.toNumber() : value))
  @ApiProperty({
    description: 'The id of permission',
    example: '1',
  })
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of permission',
    example: 'Create Account',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Permission_Module_List)
  @ApiProperty({
    description: 'Permission module',
    example: Module_Names.Accounts,
  })
  module: string;

  @ValidateIf((o) => o.module)
  @IsNotEmpty()
  @IsString()
  @Validate(IsKeyValidForModule)
  @ApiProperty({
    description: 'Permission key',
    example: AccountsModuleKeys.CREATE_ACCOUNT,
  })
  key: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Permission_Scope_List)
  @ApiProperty({
    description: 'Permission scope',
    example: Permission_Scope_Names.admin,
  })
  scope: string;
}
