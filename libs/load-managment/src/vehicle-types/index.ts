export const Vehicle_Type_Names = {
  flatbed_truck: 'flatbed_truck',
  box_truck_cargo_truck_or_van: 'box_truck_cargo_truck_or_van',
  refrigerated_truck_reefer: 'refrigerated_truck_reefer',
  tanker_truck: 'tanker_truck',
  dump_truck: 'dump_truck',
  car_carrier_truck: 'car_carrier_truck',
  dry_van: 'dry_van',
} as const;

export const Vehicle_Type_NamedDescriptions: {
  [key: string]: {
    name: string;
    description: string;
  };
} = {
  [Vehicle_Type_Names.flatbed_truck]: {
    name: 'Flatbed Truck',
    description: 'Open flat surface, used for large or heavy goods.',
  },
  [Vehicle_Type_Names.box_truck_cargo_truck_or_van]: {
    name: 'Box Truck (Cargo Truck / Van)',
    description: 'Enclosed box shape, used for general cargo and furniture.',
  },
  [Vehicle_Type_Names.refrigerated_truck_reefer]: {
    name: 'Refrigerated Truck (Reefer)',
    description:
      'Equipped with cooling units, used for transporting perishable goods.',
  },

  [Vehicle_Type_Names.tanker_truck]: {
    name: 'Tanker Truck',
    description:
      'Cylindrical container, used for transporting liquids like fuel, chemicals, or milk.',
  },

  [Vehicle_Type_Names.dump_truck]: {
    name: 'Dump Truck',
    description:
      'Used for transporting loose materials like sand, gravel, and demolition debris.',
  },

  [Vehicle_Type_Names.car_carrier_truck]: {
    name: 'Car Carrier Truck',
    description: 'Designed to transport multiple vehicles.',
  },

  [Vehicle_Type_Names.dry_van]: {
    name: 'Dry Van',
    description:
      'Fully enclosed, used for shipping non-perishable goods and general freight.',
  },
} as const;

export const Vehicle_Type_List: readonly string[] =
  Object.values(Vehicle_Type_Names);

export type Vehicle_Type =
  (typeof Vehicle_Type_Names)[keyof typeof Vehicle_Type_Names];
