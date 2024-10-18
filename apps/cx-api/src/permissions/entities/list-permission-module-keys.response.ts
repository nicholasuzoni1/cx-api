import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { AccountsModuleKeys } from '@app/permission-management/permission-module-keys/modules/accounts';
import {
  Module_Names,
  PermissionModuleKeysType,
} from '@app/permission-management/permission-module-keys';

export class PermissionModuleKeysResponseEntity {
  @ApiProperty({
    description: 'id',
    example: {
      [Module_Names.Accounts]: [AccountsModuleKeys.CREATE_ACCOUNT],
    },
  })
  moduleKeys: PermissionModuleKeysType;
}

export class ListPermissionModuleKeysResponseType extends JsonResponseClass<PermissionModuleKeysResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to list permission module keys',
    type: PermissionModuleKeysResponseEntity,
  })
  data: PermissionModuleKeysResponseEntity;
}
