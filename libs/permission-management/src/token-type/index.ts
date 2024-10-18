export type UserTokenPermissionType = {
  scope: string;
  module: string;
  key: string;
};

export type UserTokenPayloadType = {
  id: number;
  email: string;
  userType: string;
  roleId?: number;
  associatedTo?: number;
  createdBy?: number;
  permissions: UserTokenPermissionType[];
  scope: string;
};
