export const Dimension_Unit_Names = {
  mm: 'mm',
  cm: 'cm',
  in: 'in',
  ft: 'ft',
  m: 'm',
} as const;

export const Dimension_Unit_List: readonly string[] =
  Object.values(Dimension_Unit_Names);

export type Dimension_Unit_Type =
  (typeof Dimension_Unit_Names)[keyof typeof Dimension_Unit_Names];
