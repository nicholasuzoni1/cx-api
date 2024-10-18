export const Primary_User_Types = {
  admin: 'admin',
  shipper: 'shipper',
  carrier: 'carrier',
} as const;

export const Register_User_Types = {
  shipper: 'shipper',
  carrier: 'carrier',
} as const;

export const All_User_Types = {
  admin: 'admin',
  shipper: 'shipper',
  carrier: 'carrier',
  subuser: 'sub-user',
} as const;

export const Primary_User_List: readonly string[] =
  Object.values(Primary_User_Types);

export const All_User_List: readonly string[] = Object.values(All_User_Types);

export const Register_User_List: readonly string[] =
  Object.values(Register_User_Types);
