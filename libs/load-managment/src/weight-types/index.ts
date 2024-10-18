export const Weight_Unit_Names = {
  kg: 'kg',
  lb: 'lb',
} as const;

export const Weight_Unit_List: readonly string[] =
  Object.values(Weight_Unit_Names);

export type Weight_Unit_Type =
  (typeof Weight_Unit_Names)[keyof typeof Weight_Unit_Names];
