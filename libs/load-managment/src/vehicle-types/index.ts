export const Vehicle_Type_Names = {
  'Flatbed Truck': 'Flatbed Truck',
  'Box Truck (Cargo Truck / Van)': 'Box Truck (Cargo Truck / Van)',
  'Refrigerated Truck (Reefer)': 'Refrigerated Truck (Reefer)',
  'Tanker Truck': 'Tanker Truck',
  'Dump Truck': 'Dump Truck',
  'Car Carrier Truck': 'Car Carrier Truck',
  'Dry Van': 'Dry Van',
} as const;

export const Vehicle_Type_NamedDescriptions = {
  [Vehicle_Type_Names['Flatbed Truck']]:
    'Open flat surface, used for large or heavy goods.',
  [Vehicle_Type_Names['Box Truck (Cargo Truck / Van)']]:
    'Enclosed box shape, used for general cargo and furniture.',
  [Vehicle_Type_Names['Refrigerated Truck (Reefer)']]:
    'Equipped with cooling units, used for transporting perishable goods.',
  [Vehicle_Type_Names['Tanker Truck']]:
    'Cylindrical container, used for transporting liquids like fuel, chemicals, or milk.',
  [Vehicle_Type_Names['Dump Truck']]:
    'Used for transporting loose materials like sand, gravel, and demolition debris.',
  [Vehicle_Type_Names['Car Carrier Truck']]:
    'Designed to transport multiple vehicles.',
  [Vehicle_Type_Names['Dry Van']]:
    'Fully enclosed, used for shipping non-perishable goods and general freight.',
} as const;

export const Vehicle_Type_List: readonly string[] =
  Object.values(Vehicle_Type_Names);

export type Vehicle_Type =
  (typeof Vehicle_Type_Names)[keyof typeof Vehicle_Type_Names];
