import { AccountsModuleKeys } from './modules/accounts';
import { PermissionsModuleKeys } from './modules/permissions';
import { RolesModuleKeys } from './modules/roles';

export const Module_Names = {
  Accounts: 'Accounts',
  Permssions: 'Permssions',
  Roles: 'Roles',
  Loads: 'Loads',
} as const;

export const Permission_Module_List = [...Object.keys(Module_Names)] as const;

export type PermissionModuleKeysType = {
  [key: string]: string[];
};

export const Permission_Module_Keys: PermissionModuleKeysType = {
  // ACOUNTS //
  [Module_Names.Accounts]: Object.values(AccountsModuleKeys),
  // PERMISSIONS //
  [Module_Names.Permssions]: Object.values(PermissionsModuleKeys),
  // Roles //
  [Module_Names.Roles]: Object.values(RolesModuleKeys),
} as const;
