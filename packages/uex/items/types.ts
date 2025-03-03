import { getValidationObject } from "@uex/core";
import { z } from "zod";

// 1. /items endpoint schema
export const UEXItemObject = z.object({
  id: z.number(), // route ID, may change during website updates
  id_parent: z.number(),
  id_category: z.number(),
  id_company: z.number(),
  id_vehicle: z.number(), // if linked to a vehicle
  name: z.string(),
  section: z.string(), // coming from categories
  category: z.string(), // coming from categories
  company_name: z.string().nullable(), // coming from companies
  vehicle_name: z.string().nullable(), // coming from vehicles
  slug: z.string(), // UEX URLs
  uuid: z.string().nullable(), // star citizen uuid
  url_store: z.string().nullable(), // pledge store URL
  is_exclusive_pledge: z.number(),
  is_exclusive_subscriber: z.number(),
  is_exclusive_concierge: z.number(),
  // screenshot field removed as noted in documentation (suspended due to server costs)
  // attributes field removed as noted in documentation (deprecated)
  notification: z.any().optional(), // heads up about an item, such as known bugs, etc.
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
});

export type UEXItem = z.infer<typeof UEXItemObject>;

export const UEXItemsResponseObject = getValidationObject(UEXItemObject);

export type UEXItemsResponse = z.infer<typeof UEXItemsResponseObject>;
export type UEXItemsList = z.infer<typeof UEXItemObject>[];

// 2. /items_attributes endpoint schema
export const UEXItemAttributeObject = z.object({
  id: z.number(),
  id_item: z.number(),
  id_category: z.number(),
  id_category_attribute: z.number(),
  category_name: z.string(),
  item_name: z.string(),
  item_uuid: z.string().nullable(),
  attribute_name: z.string(),
  value: z.string(),
  unit: z.string().nullable(),
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
});

export type UEXItemAttribute = z.infer<typeof UEXItemAttributeObject>;

export const UEXItemAttributesResponseObject = getValidationObject(
  UEXItemAttributeObject
);

export type UEXItemAttributesResponse = z.infer<
  typeof UEXItemAttributesResponseObject
>;
export type UEXItemAttributesList = z.infer<typeof UEXItemAttributeObject>[];

// 3. /items_prices endpoint schema
export const UEXItemPriceObject = z.object({
  id: z.number(),
  id_item: z.number(),
  id_parent: z.number(),
  id_category: z.number().nullable(),
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

  // Buy prices
  price_buy: z.number().nullable(), // last reported price
  price_buy_min: z.number(),
  price_buy_min_week: z.number(),
  price_buy_min_month: z.number(),
  price_buy_max: z.number(),
  price_buy_max_week: z.number(),
  price_buy_max_month: z.number(),
  price_buy_avg: z.number(),
  price_buy_avg_week: z.number(),
  price_buy_avg_month: z.number(),

  // Sell prices
  price_sell: z.number().nullable(), // last reported price
  price_sell_min: z.number(),
  price_sell_min_week: z.number(),
  price_sell_min_month: z.number(),
  price_sell_max: z.number(),
  price_sell_max_week: z.number(),
  price_sell_max_month: z.number(),
  price_sell_avg: z.number(),
  price_sell_avg_week: z.number(),
  price_sell_avg_month: z.number(),

  // Durability
  durability: z.number(), // last reported durability (%)
  durability_min: z.number(),
  durability_min_week: z.number(),
  durability_min_month: z.number(),
  durability_max: z.number(),
  durability_max_week: z.number(),
  durability_max_month: z.number(),
  durability_avg: z.number(),
  durability_avg_week: z.number(),
  durability_avg_month: z.number(),

  // Faction
  faction_affinity: z.number().optional(), // datarunner's affinity average at a location (from -100 to 100)

  // Other
  game_version: z.string(),
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  item_name: z.string().nullable(),
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

export type UEXItemPrice = z.infer<typeof UEXItemPriceObject>;

export const UEXItemPricesResponseObject =
  getValidationObject(UEXItemPriceObject);

export type UEXItemPricesResponse = z.infer<typeof UEXItemPricesResponseObject>;
export type UEXItemPricesList = z.infer<typeof UEXItemPriceObject>[];

// 4. /items_prices_all endpoint schema
export const UEXItemPriceAllObject = z.object({
  id: z.number(),
  id_item: z.number(),
  id_terminal: z.number(),
  id_category: z.number().nullable(),
  price_buy: z.number().nullable(), // last reported price in UEC, per unit
  price_sell: z.number().nullable(), // last reported price in UEC, per unit
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  item_name: z.string().nullable(),
  item_uuid: z.string().nullable(), // star citizen uuid
  terminal_name: z.string(),
});

export type UEXItemPriceAll = z.infer<typeof UEXItemPriceAllObject>;

export const UEXItemPricesAllResponseObject = getValidationObject(
  UEXItemPriceAllObject
);

export type UEXItemPricesAllResponse = z.infer<
  typeof UEXItemPricesAllResponseObject
>;

export type UEXItemPricesAllList = z.infer<typeof UEXItemPriceAllObject>[];

// Filter types for the various endpoints
export type ItemsFilter = {
  id_category?: number;
  id_company?: number;
  uuid?: string;
};

export type ItemAttributesFilter = {
  id_item?: number;
  id_category?: number;
  uuid?: string;
};

export type ItemPricesFilter = {
  id_terminal?: number | string; // Supports comma-separated list of up to 10 ids
  id_item?: number;
  id_category?: number;
  uuid?: string;
};
