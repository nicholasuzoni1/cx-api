import {
  Permission_Module_List,
  Permission_Module_Keys,
  Module_Names,
} from '@app/permission-management/permission-module-keys';
import { AccountsModuleKeys } from '@app/permission-management/permission-module-keys/modules/accounts';
import {
  Permission_Scope_List,
  Permission_Scope_Names,
} from '@app/permission-management/permission-scopes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsString,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  ValidateIf,
} from 'class-validator';

// Custom Validator to check if the key belongs to the selected module
@ValidatorConstraint({ name: 'IsKeyValidForModule', async: false })
export class IsKeyValidForModule implements ValidatorConstraintInterface {
  validate(key: string, args: ValidationArguments) {
    const module = (args.object as CreatePermissionDto).module;
    const validKeys = Permission_Module_Keys[module]; // Map of keys per module
    return validKeys && validKeys.includes(key);
  }

  defaultMessage(args: ValidationArguments) {
    const module = (args.object as CreatePermissionDto).module;
    return `Key must be one of the following for module '${module}': ${Permission_Module_Keys[module].join(', ')}`;
  }
}

export class CreatePermissionDto {
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
  @Validate(IsKeyValidForModule) // Custom validation to check the key based on module
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
