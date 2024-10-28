export const Contract_Names = {
  Awaiting: 'awaiting',
  Accepted: 'accepted',
  Rejected: 'rejected',
  Cancelled: 'cancelled',
  m: 'm',
} as const;

export const Contract_List: readonly string[] = Object.values(Contract_Names);

export type Contract_Type =
  (typeof Contract_Names)[keyof typeof Contract_Names];
