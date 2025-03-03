import { getValidationObject } from "@uex/core";
import { z } from "zod";

// 1. Define schema for /vehicles endpoint
export const UEXVehicleObject = z.object({
  id: z.number(),
  id_company: z.number(), // vehicle manufacturer
  id_parent: z.number(), // parent ship series
  ids_vehicles_loaners: z.string().nullable(), // vehicles loaned, comma separated
  name: z.string(),
  name_full: z.string(),
  slug: z.string(),
  uuid: z.string().nullable(), // star citizen uuid
  scu: z.number(),
  crew: z.string().nullable(), // comma separated
  mass: z.number(),
  width: z.number(),
  height: z.number(),
  length: z.number(),
  fuel_quantum: z.number(), // SCU
  fuel_hydrogen: z.number(), // SCU
  container_sizes: z.string().nullable(), // SCU, comma separated
  is_addon: z.number(), // e.g. RSI Galaxy Refinery Module
  is_boarding: z.number(),
  is_bomber: z.number(),
  is_cargo: z.number(),
  is_carrier: z.number(),
  is_civilian: z.number(),
  is_concept: z.number(),
  is_construction: z.number(),
  is_datarunner: z.number(),
  is_docking: z.number(), // contains docking port
  is_emp: z.number(),
  is_exploration: z.number(),
  is_ground_vehicle: z.number(),
  is_hangar: z.number(), // contains hangar
  is_industrial: z.number(),
  is_interdiction: z.number(),
  is_loading_dock: z.number(), // cargo can be loaded/unloaded via docking
  is_medical: z.number(),
  is_military: z.number(),
  is_mining: z.number(),
  is_passenger: z.number(),
  is_qed: z.number(),
  is_racing: z.number(),
  is_refinery: z.number(),
  is_refuel: z.number(),
  is_repair: z.number(),
  is_research: z.number(),
  is_salvage: z.number(),
  is_scanning: z.number(),
  is_science: z.number(),
  is_showdown_winner: z.number(),
  is_spaceship: z.number(),
  is_starter: z.number(),
  is_stealth: z.number(),
  is_tractor_beam: z.number(),
  is_quantum_capable: z.number(),
  url_store: z.string().nullable(),
  url_brochure: z.string().nullable(),
  url_hotsite: z.string().nullable(),
  url_video: z.string().nullable(),
  // url_photos field removed as noted in documentation (deprecated)
  pad_type: z.string().nullable(), // XS, S, M, L, XL
  game_version: z.string(), // version it was announced or updated
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
  company_name: z.string(), // manufacturer name
});

export type UEXVehicle = z.infer<typeof UEXVehicleObject>;

export const UEXVehiclesResponseObject = getValidationObject(UEXVehicleObject);

export type UEXVehiclesResponse = z.infer<typeof UEXVehiclesResponseObject>;
export type UEXVehiclesList = z.infer<typeof UEXVehicleObject>[];

// 2. Define schema for /vehicles_loaners endpoint
// First, define the loaner vehicle schema
export const UEXLoanerVehicleObject = z.object({
  id: z.number(),
  id_company: z.number(),
  id_parent: z.number(),
  ids_vehicles_loaners: z.string().nullable(),
  name: z.string(),
  name_full: z.string(),
  scu: z.number(),
  crew: z.string(),
  is_addon: z.number(),
  is_concept: z.number(),
  is_civilian: z.number(),
  is_military: z.number(),
  is_exploration: z.number(),
  is_passenger: z.number(),
  is_industrial: z.number(),
  is_mining: z.number(),
  is_salvage: z.number(),
  is_refinery: z.number(),
  is_cargo: z.number(),
  is_medical: z.number(),
  is_racing: z.number(),
  is_repair: z.number(),
  is_refuel: z.number(),
  is_interdiction: z.number(),
  is_tractor_beam: z.number(),
  is_qed: z.number(),
  is_emp: z.number(),
  is_construction: z.number(),
  is_datarunner: z.number(),
  is_science: z.number(),
  is_boarding: z.number(),
  is_stealth: z.number(),
  is_research: z.number(),
  is_carrier: z.number(),
  is_ground_vehicle: z.number(),
  is_spaceship: z.number(),
  is_showdown_winner: z.number(),
  url_store: z.string(),
  url_brochure: z.string().nullable(),
  url_hotsite: z.string().nullable(),
  url_video: z.string().nullable(),
  url_photos: z.any().optional(),
  game_version: z.string(),
  date_added: z.number(),
  date_modified: z.number(),
  company_name: z.string(),
});

// Now define the vehicle with loaners schema
export const UEXVehicleLoanersObject = z.object({
  id: z.number(),
  id_company: z.number(),
  id_parent: z.number(),
  ids_vehicles_loaners: z.string().nullable(),
  name: z.string(),
  name_full: z.string(),
  uuid: z.string().nullable().optional(),
  scu: z.number(),
  crew: z.string(),
  is_addon: z.number(),
  is_concept: z.number(),
  is_civilian: z.number(),
  is_military: z.number(),
  is_exploration: z.number(),
  is_passenger: z.number(),
  is_industrial: z.number(),
  is_mining: z.number(),
  is_salvage: z.number(),
  is_refinery: z.number(),
  is_cargo: z.number(),
  is_medical: z.number(),
  is_racing: z.number(),
  is_repair: z.number(),
  is_refuel: z.number(),
  is_interdiction: z.number(),
  is_tractor_beam: z.number(),
  is_qed: z.number(),
  is_emp: z.number(),
  is_construction: z.number(),
  is_datarunner: z.number(),
  is_science: z.number(),
  is_boarding: z.number(),
  is_stealth: z.number(),
  is_research: z.number(),
  is_carrier: z.number(),
  is_ground_vehicle: z.number(),
  is_spaceship: z.number(),
  is_showdown_winner: z.number(),
  url_store: z.string(),
  url_brochure: z.string().nullable(),
  url_hotsite: z.string().nullable(),
  url_video: z.string().nullable().optional(),
  url_photos: z.any().optional(),
  game_version: z.string(),
  date_added: z.number(),
  date_modified: z.number(),
  company_name: z.string(),
  loaners: z.array(UEXLoanerVehicleObject).optional(),
});

export const UEXVehicleLoanersResponseObject = getValidationObject(
  UEXLoanerVehicleObject
);

export type UEXVehicleLoanersResponse = z.infer<
  typeof UEXVehicleLoanersResponseObject
>;

export type UEXVehicleLoanersList = z.infer<typeof UEXVehicleLoanersObject>[];

// 3. Define schema for /vehicles_prices endpoint
export const UEXVehiclePriceObject = z.object({
  id: z.number(),
  id_vehicle: z.number(),
  price: z.number(),
  price_warbond: z.number(),
  price_package: z.number(),
  price_concierge: z.number(),
  on_sale: z.number(),
  on_sale_warbond: z.number(),
  on_sale_package: z.number(),
  on_sale_concierge: z.number(),
  currency: z.string(), // e.g. USD for US Dollar
  game_version: z.string(),
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  vehicle_name: z.string(),
});

export type UEXVehiclePrice = z.infer<typeof UEXVehiclePriceObject>;

export const UEXVehiclePricesResponseObject = getValidationObject(
  UEXVehiclePriceObject
);

export type UEXVehiclePricesResponse = z.infer<
  typeof UEXVehiclePricesResponseObject
>;
export type UEXVehiclePricesList = z.infer<typeof UEXVehiclePriceObject>[];

// 4. Define schema for /vehicles_purchases_prices endpoint
export const UEXVehiclePurchasePriceObject = z.object({
  id: z.number(),
  id_vehicle: z.number(),
  id_star_system: z.number(),
  id_planet: z.number(),
  id_orbit: z.number(),
  id_moon: z.number(),
  id_city: z.number(),
  id_outpost: z.number(),
  id_poi: z.number(),
  id_faction: z.number(),
  id_terminal: z.number(),
  price_buy: z.number(), // last reported price
  price_buy_min: z.number(),
  price_buy_min_week: z.number(),
  price_buy_min_month: z.number(),
  price_buy_max: z.number(),
  price_buy_max_week: z.number(),
  price_buy_max_month: z.number(),
  price_buy_avg: z.number(),
  price_buy_avg_week: z.number(),
  price_buy_avg_month: z.number(),
  faction_affinity: z.number().optional(), // datarunner's affinity average at a location (from -100 to 100)
  game_version: z.string(),
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  datarunner: z.string(), // last user to update this price
  star_system_name: z.string(),
  planet_name: z.string(),
  orbit_name: z.string(),
  moon_name: z.string(),
  space_station_name: z.string(),
  outpost_name: z.string(),
  city_name: z.string(),
  terminal_name: z.string(),
  terminal_code: z.string(),
  terminal_is_player_owned: z.number(),
});

export type UEXVehiclePurchasePrice = z.infer<
  typeof UEXVehiclePurchasePriceObject
>;

export const UEXVehiclePurchasePricesResponseObject = getValidationObject(
  UEXVehiclePurchasePriceObject
);

export type UEXVehiclePurchasePricesResponse = z.infer<
  typeof UEXVehiclePurchasePricesResponseObject
>;
export type UEXVehiclePurchasePricesList = z.infer<
  typeof UEXVehiclePurchasePriceObject
>[];

// 5. Define schema for /vehicles_purchases_prices_all endpoint
export const UEXVehiclePurchasePriceAllObject = z.object({
  id: z.number(),
  id_vehicle: z.number(),
  id_terminal: z.number(),
  price_buy: z.number(), // last reported price in UEC
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  vehicle_name: z.string(),
  terminal_name: z.string(),
});

export type UEXVehiclePurchasePriceAll = z.infer<
  typeof UEXVehiclePurchasePriceAllObject
>;

export const UEXVehiclePurchasePricesAllResponseObject = getValidationObject(
  UEXVehiclePurchasePriceAllObject
);

export type UEXVehiclePurchasePricesAllResponse = z.infer<
  typeof UEXVehiclePurchasePricesAllResponseObject
>;
export type UEXVehiclePurchasePricesAllList = z.infer<
  typeof UEXVehiclePurchasePriceAllObject
>[];

// 6. Define schema for /vehicles_rentals_prices endpoint
export const UEXVehicleRentalPriceObject = z.object({
  id: z.number(),
  id_vehicle: z.number(),
  id_star_system: z.number(),
  id_planet: z.number(),
  id_orbit: z.number(),
  id_moon: z.number(),
  id_city: z.number(),
  id_outpost: z.number(),
  id_poi: z.number(),
  id_faction: z.number(),
  id_terminal: z.number(),
  price_rent: z.number(), // last reported price
  price_rent_min: z.number(),
  price_rent_min_week: z.number(),
  price_rent_min_month: z.number(),
  price_rent_max: z.number(),
  price_rent_max_week: z.number(),
  price_rent_max_month: z.number(),
  price_rent_avg: z.number(),
  price_rent_avg_week: z.number(),
  price_rent_avg_month: z.number(),
  faction_affinity: z.number().optional(), // datarunner's affinity average at a location (from -100 to 100)
  game_version: z.string(),
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  datarunner: z.string(), // last user to update this price
  star_system_name: z.string(),
  planet_name: z.string(),
  orbit_name: z.string(),
  moon_name: z.string(),
  space_station_name: z.string(),
  outpost_name: z.string(),
  city_name: z.string(),
  terminal_name: z.string(),
  terminal_code: z.string(),
  terminal_is_player_owned: z.number(),
});

export type UEXVehicleRentalPrice = z.infer<typeof UEXVehicleRentalPriceObject>;

export const UEXVehicleRentalPricesResponseObject = getValidationObject(
  UEXVehicleRentalPriceObject
);

export type UEXVehicleRentalPricesResponse = z.infer<
  typeof UEXVehicleRentalPricesResponseObject
>;
export type UEXVehicleRentalPricesList = z.infer<
  typeof UEXVehicleRentalPriceObject
>[];

// 7. Define schema for /vehicles_rentals_prices_all endpoint
export const UEXVehicleRentalPriceAllObject = z.object({
  id: z.number(),
  id_vehicle: z.number(),
  id_terminal: z.number(),
  price_rent: z.number(), // last reported price in UEC
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  vehicle_name: z.string(),
  terminal_name: z.string(),
});

export type UEXVehicleRentalPriceAll = z.infer<
  typeof UEXVehicleRentalPriceAllObject
>;

export const UEXVehicleRentalPricesAllResponseObject = getValidationObject(
  UEXVehicleRentalPriceAllObject
);

export type UEXVehicleRentalPricesAllResponse = z.infer<
  typeof UEXVehicleRentalPricesAllResponseObject
>;
export type UEXVehicleRentalPricesAllList = z.infer<
  typeof UEXVehicleRentalPriceAllObject
>[];

// Filter types for each endpoint
export type VehiclesFilter = {
  id_company?: number;
};

export type VehicleLoanersFilter = {
  id_vehicle?: number;
  uuid?: string;
  name?: string;
};

export type VehiclePricesFilter = {
  id_vehicle?: number;
  uuid?: string;
};

export type VehiclePurchasePricesFilter = {
  id_terminal?: number | string; // Supports comma-separated list
  id_vehicle?: number;
  uuid?: string;
};

export type VehicleRentalPricesFilter = {
  id_terminal?: number | string; // Supports comma-separated list
  id_vehicle?: number;
  uuid?: string;
};
