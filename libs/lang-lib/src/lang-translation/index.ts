import { LangKeys } from '../lang-keys';

type LangTranslationType = {
  [key: string]: {
    english: string;
    spanish: string;
  };
};

export const LangTranslation: LangTranslationType = {
  [LangKeys.SystemErrorKey]: {
    english: 'System Error',
    spanish: 'System Error',
  },

  [LangKeys.SomethingWentWrongKey]: {
    english: 'Something went wrong',
    spanish: 'Something went wrong',
  },
  [LangKeys.UnAuthorizedErrorKey]: {
    english: 'You are not authorized to perform this operation',
    spanish: 'You are not authorized to perform this operation',
  },

  [LangKeys.AccountAlreadyExistsKey]: {
    english: 'Account already exists',
    spanish: 'Account already exists',
  },
  [LangKeys.ValidationErrorKey]: {
    english: 'Validation error',
    spanish: 'Validation error',
  },
  [LangKeys.AccountNotFoundErrorKey]: {
    english: 'Account not found',
    spanish: 'Account not found',
  },
  [LangKeys.OtpNotFoundErrorKey]: {
    english: 'Otp not found',
    spanish: 'Otp not found',
  },
  [LangKeys.SessionExpiresErrorKey]: {
    english: 'Session Expired.',
    spanish: 'Session Expired.',
  },
  [LangKeys.InvalidCredentialsErrorKey]: {
    english: 'Invalid credentials',
    spanish: 'Credenciales no válidas',
  },
  [LangKeys.InvalidOldPasswordErrorKey]: {
    english: 'Invalid old password',
    spanish: 'Invalid old password',
  },
  // Permission Error Keys //
  [LangKeys.DuplicatePermissionErrorKey]: {
    english: 'Duplicate permission not allowed',
    spanish: 'Duplicate permission not allowed',
  },
  [LangKeys.PermissionNotFoundErrorKey]: {
    english: 'Permission not found',
    spanish: 'Permission not found',
  },
  [LangKeys.InvalidPermissionsSelectedErrorKey]: {
    english: 'Invalid permissions selected',
    spanish: 'Invalid permissions selected',
  },
  [LangKeys.InvalideScopeValueErrorKey]: {
    english: 'Invalid scope value',
    spanish: 'Invalid scope value',
  },
  // Role Error Keys //
  [LangKeys.RoleNotFoundErrorKey]: {
    english: 'Role not found',
    spanish: 'Role not found',
  },
  // Admin Error Keys //
  [LangKeys.AdminAccessOnlyErrorKey]: {
    english: 'Only admin can access this resource.',
    spanish: 'Only admin can access this resource.',
  },
  // Access Permission Not found
  [LangKeys.AccessPermissionNotFound]: {
    english: 'You don not have access permission',
    spanish: 'You don not have access permission',
  },
  // Load Keys
  [LangKeys.LoadNotFoundErrorKey]: {
    english: 'Load not found',
    spanish: 'Load not found',
  },
  // Bid keys
  [LangKeys.DuplicateBidErrorKey]: {
    english: 'Duplicate bid not allowed',
    spanish: 'Duplicate bid not allowed',
  },
} as const;
