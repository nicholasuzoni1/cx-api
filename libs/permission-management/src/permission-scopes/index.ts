export const Permission_Scope_Names = {
  admin: 'admin',
  shipper: 'shipper',
  carrier: 'carrier',
} as const;

export const Permission_Scope_List: readonly string[] = Object.values(
  Permission_Scope_Names,
);

export type Permission_Scope_Type =
  (typeof Permission_Scope_Names)[keyof typeof Permission_Scope_Names];
