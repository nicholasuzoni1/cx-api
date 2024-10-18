import { UserTokenPayloadType } from '../token-type';
import { Primary_User_Types } from '../users';

export const getAssociationId = (user: UserTokenPayloadType) =>
  Primary_User_Types[user.userType] ? user.id : user.associatedTo;
