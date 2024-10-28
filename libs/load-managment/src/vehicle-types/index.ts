export const Vehicle_Type_Names = {
  FLATBED_TRUCK: 'flatbed_truck',
  BOX_TRUCK_CARGO_TRUCK_OR_VAN: 'box_truck_cargo_truck_or_van',
  REFRIGERATED_TRUCK_REEFER: 'refrigerated_truck_reefer',
  TANKER_TRUCK: 'tanker_truck',
  DUMP_TRUCK: 'dump_truck',
  CAR_CARRIER_TRUCK: 'car_carrier_truck',
  DRY_VAN: 'dry_van',
} as const;

export const Vehicle_Type_NamedDescriptions: {
  [key: string]: {
    name: string;
    description: string;
  };
} = {
  [Vehicle_Type_Names.FLATBED_TRUCK]: {
    name: 'Flatbed Truck',
    description: 'Open flat surface, used for large or heavy goods.',
  },
  [Vehicle_Type_Names.BOX_TRUCK_CARGO_TRUCK_OR_VAN]: {
    name: 'Box Truck (Cargo Truck / Van)',
    description: 'Enclosed box shape, used for general cargo and furniture.',
  },
  [Vehicle_Type_Names.REFRIGERATED_TRUCK_REEFER]: {
    name: 'Refrigerated Truck (Reefer)',
    description:
      'Equipped with cooling units, used for transporting perishable goods.',
  },

  [Vehicle_Type_Names.TANKER_TRUCK]: {
    name: 'Tanker Truck',
    description:
      'Cylindrical container, used for transporting liquids like fuel, chemicals, or milk.',
  },

  [Vehicle_Type_Names.DUMP_TRUCK]: {
    name: 'Dump Truck',
    description:
      'Used for transporting loose materials like sand, gravel, and demolition debris.',
  },

  [Vehicle_Type_Names.CAR_CARRIER_TRUCK]: {
    name: 'Car Carrier Truck',
    description: 'Designed to transport multiple vehicles.',
  },

  [Vehicle_Type_Names.DRY_VAN]: {
    name: 'Dry Van',
    description:
      'Fully enclosed, used for shipping non-perishable goods and general freight.',
  },
} as const;

export const Vehicle_Type_List: readonly string[] =
  Object.values(Vehicle_Type_Names);

export type Vehicle_Type =
  (typeof Vehicle_Type_Names)[keyof typeof Vehicle_Type_Names];
