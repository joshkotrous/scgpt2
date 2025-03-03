import { getValidationObject } from "@uex/core";
import { z } from "zod";

// Define the schema for fuel price information based on the API documentation
export const UEXFuelPriceObject = z.object({
  id: z.number(),
  id_commodity: z.number(),
  id_star_system: z.number(),
  id_planet: z.number(),
  id_orbit: z.number(),
  id_moon: z.number(),
  id_city: z.number(),
  id_outpost: z.number(),
  id_poi: z.number(),
  id_faction: z.number(),
  id_terminal: z.number(),

  // Purchase prices (per SCU)
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

  // Factions
  faction_affinity: z.number().optional(), // datarunner's affinity average at a location (from -100 to 100)

  // Other
  game_version: z.string(),
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  commodity_name: z.string(),
  commodity_code: z.string(),
  commodity_slug: z.string(),
  star_system_name: z.string(),
  planet_name: z.string(),
  orbit_name: z.string(),
  moon_name: z.string(),
  space_station_name: z.string(),
  outpost_name: z.string(),
  city_name: z.string(),
  terminal_name: z.string(),
  terminal_code: z.string(),
  terminal_slug: z.string(),
  terminal_mcs: z.number(), // maximum container size operated by freight elevator (in SCU)
});

export type UEXFuelPrice = z.infer<typeof UEXFuelPriceObject>;

export const UEXFuelPricesResponseObject =
  getValidationObject(UEXFuelPriceObject);

export type UEXFuelPricesResponse = z.infer<typeof UEXFuelPricesResponseObject>;

export const UEXFuelPriceAllObject = z.object({
  id: z.number(),
  id_commodity: z.number(),
  id_terminal: z.number(),
  price_buy: z.number(), // last reported price per SCU
  price_buy_avg: z.number(), // average price per SCU
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  commodity_name: z.string(),
  commodity_code: z.string().optional(),
  commodity_slug: z.string().optional(),
  terminal_name: z.string(),
  terminal_code: z.string().optional(),
  terminal_slug: z.string().optional(),
});

export type UEXFuelPriceAll = z.infer<typeof UEXFuelPriceAllObject>;

export const UEXFuelPricesAllResponseObject = getValidationObject(
  UEXFuelPriceAllObject
);

export type UEXFuelPricesAllResponse = z.infer<
  typeof UEXFuelPricesAllResponseObject
>;
export type UEXFuelPricesAllList = z.infer<typeof UEXFuelPriceAllObject>[];

// Filter type for fuel prices endpoint
export type FuelPricesFilter = {
  id_terminal?: number | string; // Supports comma-separated list of up to 10 ids
  id_commodity?: number;
  terminal_name?: string;
  terminal_code?: string;
  terminal_slug?: string;
  commodity_name?: string;
  commodity_code?: string;
  commodity_slug?: string;
};
