import { getValidationObject } from "@uex/core";
import { z } from "zod";

export const UEXCommodityObject = z.object({
  id: z.number(),
  id_parent: z.number(),
  name: z.string(),
  code: z.string(),
  kind: z.string(),
  weight_scu: z.number(),
  price_buy: z.number(),
  price_sell: z.number(),
  is_available: z.number(),
  is_available_live: z.number(),
  is_visible: z.number(),
  is_mineral: z.number(),
  is_raw: z.number(),
  is_refined: z.number(),
  is_harvestable: z.number(),
  is_buyable: z.number(),
  is_sellable: z.number(),
  is_temporary: z.number(),
  is_illegal: z.number(),
  is_fuel: z.number(),
  wiki: z.string(),
  date_added: z.number(),
  date_modified: z.number(),
});

export const UEXListCommoditiesResponseObject =
  getValidationObject(UEXCommodityObject);

export type UEXListCommoditiesResponse = z.infer<
  typeof UEXListCommoditiesResponseObject
>;
export type UEXCommodity = z.infer<typeof UEXCommodityObject>;
export type UEXListCommoditiesList = z.infer<typeof UEXCommodityObject>[];

export const UEXCommodityAverageObject = z.object({
  id: z.number(),
  id_commodity: z.number(),
  price_buy: z.number(),
  price_buy_min: z.number(),
  price_buy_min_week: z.number(),
  price_buy_min_month: z.number(),
  price_buy_max: z.number(),
  price_buy_max_week: z.number(),
  price_buy_max_month: z.number(),
  price_buy_avg: z.number(),
  price_buy_avg_week: z.number(),
  price_buy_avg_month: z.number(),
  price_buy_users: z.number(),
  price_buy_users_rows: z.number(),
  price_sell: z.number(),
  price_sell_min: z.number(),
  price_sell_min_week: z.number(),
  price_sell_min_month: z.number(),
  price_sell_max: z.number(),
  price_sell_max_week: z.number(),
  price_sell_max_month: z.number(),
  price_sell_avg: z.number(),
  price_sell_avg_week: z.number(),
  price_sell_avg_month: z.number(),
  price_sell_users: z.number(),
  price_sell_users_rows: z.number(),
  scu_buy: z.number(),
  scu_buy_min: z.number(),
  scu_buy_min_week: z.number(),
  scu_buy_min_month: z.number(),
  scu_buy_max: z.number(),
  scu_buy_max_week: z.number(),
  scu_buy_max_month: z.number(),
  scu_buy_avg: z.number(),
  scu_buy_avg_week: z.number(),
  scu_buy_avg_month: z.number(),
  scu_buy_total: z.number(),
  scu_buy_total_week: z.number(),
  scu_buy_total_month: z.number(),
  scu_buy_users: z.number(),
  scu_buy_users_rows: z.number(),
  scu_sell_stock: z.number(),
  scu_sell_stock_week: z.number(),
  scu_sell_stock_month: z.number(),
  scu_sell: z.number(),
  scu_sell_min: z.number(),
  scu_sell_min_week: z.number(),
  scu_sell_min_month: z.number(),
  scu_sell_max: z.number(),
  scu_sell_max_week: z.number(),
  scu_sell_max_month: z.number(),
  scu_sell_avg: z.number(),
  scu_sell_avg_week: z.number(),
  scu_sell_avg_month: z.number(),
  scu_sell_total: z.number(),
  scu_sell_total_week: z.number(),
  scu_sell_total_month: z.number(),
  scu_sell_users: z.number(),
  scu_sell_users_rows: z.number(),
  status_buy: z.number(),
  status_buy_min: z.number(),
  status_buy_min_week: z.number(),
  status_buy_min_month: z.number(),
  status_buy_max: z.number(),
  status_buy_max_week: z.number(),
  status_buy_max_month: z.number(),
  status_buy_avg: z.number(),
  status_buy_avg_week: z.number(),
  status_buy_avg_month: z.number(),
  status_sell: z.number(),
  status_sell_min: z.number(),
  status_sell_min_week: z.number(),
  status_sell_min_month: z.number(),
  status_sell_max: z.number(),
  status_sell_max_week: z.number(),
  status_sell_max_month: z.number(),
  status_sell_avg: z.number(),
  status_sell_avg_week: z.number(),
  status_sell_avg_month: z.number(),
  volatility_buy: z.number(),
  volatility_sell: z.number(),
  volatility_price_buy: z.number(),
  volatility_price_sell: z.number(),
  volatility_scu_buy: z.number(),
  volatility_scu_sell: z.number(),
  cax_score: z.number(),
  game_version: z.string(),
  date_added: z.number(),
  date_modified: z.number(),
  commodity_name: z.string(),
  commodity_code: z.string(),
  commodity_slug: z.string(),
});

export type UEXCommodityAverage = z.infer<typeof UEXCommodityAverageObject>;

export const UEXListCommodityAveragesResponseObject = getValidationObject(
  UEXCommodityAverageObject
);

export type UEXListCommodityAveragesResponse = z.infer<
  typeof UEXListCommodityAveragesResponseObject
>;
export type UEXCommodityAverageList = z.infer<
  typeof UEXCommodityAverageObject
>[];

export const UEXCommodityPriceObject = z.object({
  id: z.number(),
  id_commodity: z.number(),
  id_star_system: z.number().optional(),
  id_planet: z.number().optional(),
  id_orbit: z.number().optional(),
  id_moon: z.number().optional(),
  id_city: z.number().optional(),
  id_outpost: z.number().optional(),
  id_poi: z.number().optional(),
  id_faction: z.number().optional(),
  id_terminal: z.number().optional(),

  // Purchase prices
  price_buy: z.number(),
  price_buy_min: z.number(),
  price_buy_min_week: z.number(),
  price_buy_min_month: z.number(),
  price_buy_max: z.number(),
  price_buy_max_week: z.number(),
  price_buy_max_month: z.number(),
  price_buy_avg: z.number(),
  price_buy_avg_week: z.number(),
  price_buy_avg_month: z.number(),
  price_buy_users: z.number(),
  price_buy_users_rows: z.number(),

  // Sell prices
  price_sell: z.number(),
  price_sell_min: z.number(),
  price_sell_min_week: z.number(),
  price_sell_min_month: z.number(),
  price_sell_max: z.number(),
  price_sell_max_week: z.number(),
  price_sell_max_month: z.number(),
  price_sell_avg: z.number(),
  price_sell_avg_week: z.number(),
  price_sell_avg_month: z.number(),
  price_sell_users: z.number(),
  price_sell_users_rows: z.number(),

  // SCU purchase availability
  scu_buy: z.number(),
  scu_buy_min: z.number(),
  scu_buy_min_week: z.number(),
  scu_buy_min_month: z.number(),
  scu_buy_max: z.number(),
  scu_buy_max_week: z.number(),
  scu_buy_max_month: z.number(),
  scu_buy_avg: z.number(),
  scu_buy_avg_week: z.number(),
  scu_buy_avg_month: z.number(),
  scu_buy_users: z.number().optional(),
  scu_buy_users_rows: z.number().optional(),

  // Reported inventory SCU at location
  scu_sell_stock: z.number(),
  scu_sell_stock_avg: z.number().optional(),
  scu_sell_stock_week: z.number().optional(),
  scu_sell_stock_avg_week: z.number().optional(),
  scu_sell_stock_month: z.number().optional(),
  scu_sell_stock_avg_month: z.number().optional(),

  // SCU sell demand
  scu_sell: z.number(),
  scu_sell_min: z.number(),
  scu_sell_min_week: z.number(),
  scu_sell_min_month: z.number(),
  scu_sell_max: z.number(),
  scu_sell_max_week: z.number(),
  scu_sell_max_month: z.number(),
  scu_sell_avg: z.number(),
  scu_sell_avg_week: z.number(),
  scu_sell_avg_month: z.number(),
  scu_sell_users: z.number().optional(),
  scu_sell_users_rows: z.number().optional(),

  // Inventory state
  status_buy: z.number(),
  status_buy_min: z.number(),
  status_buy_min_week: z.number(),
  status_buy_min_month: z.number(),
  status_buy_max: z.number(),
  status_buy_max_week: z.number(),
  status_buy_max_month: z.number(),
  status_buy_avg: z.number(),
  status_buy_avg_week: z.number(),
  status_buy_avg_month: z.number(),

  status_sell: z.number(),
  status_sell_min: z.number(),
  status_sell_min_week: z.number(),
  status_sell_min_month: z.number(),
  status_sell_max: z.number(),
  status_sell_max_week: z.number(),
  status_sell_max_month: z.number(),
  status_sell_avg: z.number(),
  status_sell_avg_week: z.number(),
  status_sell_avg_month: z.number(),

  // Volatility
  volatility_price_buy: z.number(),
  volatility_price_sell: z.number(),
  volatility_scu_buy: z.number(),
  volatility_scu_sell: z.number(),
  volatility_buy: z.number().optional(), // deprecated
  volatility_sell: z.number().optional(), // deprecated

  // Faction
  faction_affinity: z.number().optional(),

  // Container
  container_sizes: z.string().optional(),

  // Other metadata
  game_version: z.string(),
  date_added: z.number(),
  date_modified: z.number(),
  commodity_name: z.string(),
  commodity_code: z.string(),
  commodity_slug: z.string(),
  star_system_name: z.string().optional(),
  planet_name: z.string().optional(),
  orbit_name: z.string().optional(),
  moon_name: z.string().optional(),
  space_station_name: z.string().optional(),
  outpost_name: z.string().optional(),
  city_name: z.string().optional(),
  terminal_name: z.string().optional(),
  terminal_code: z.string().optional(),
  terminal_slug: z.string().optional(),
  terminal_mcs: z.number().optional(),
  terminal_is_player_owned: z.number().optional(),
});

export type UEXCommodityPrice = z.infer<typeof UEXCommodityPriceObject>;

export const UEXCommodityPricesResponseObject = getValidationObject(
  UEXCommodityPriceObject
);

export type UEXCommodityPricesResponse = z.infer<
  typeof UEXCommodityPricesResponseObject
>;
export type CommodityPricesFilter = {
  id_terminal?: number | string;
  id_commodity?: number;
  terminal_name?: string;
  terminal_code?: string;
  terminal_slug?: string;
  commodity_name?: string;
  commodity_code?: string;
  commodity_slug?: string;
};

export const UEXCommodityPriceAllObject = z.object({
  id: z.number(),
  id_commodity: z.number(),
  id_terminal: z.number(),
  price_buy: z.number(), // last reported price per SCU
  price_buy_avg: z.number(), // average price per SCU
  price_sell: z.number(), // last reported price per SCU
  price_sell_avg: z.number(), // average price per SCU
  scu_buy: z.number(), // last reported supply
  scu_buy_avg: z.number(), // average supply
  scu_sell_stock: z.number(), // last amount of SCU reported at location
  scu_sell_stock_avg: z.number(), // average SCU reported at location
  scu_sell: z.number(), // last reported demand
  scu_sell_avg: z.number(), // average demand
  status_buy: z.number(), // last reported supplier inventory state
  status_sell: z.number(), // last reported demander inventory state
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  commodity_name: z.string(),
  commodity_code: z.string().optional(),
  commodity_slug: z.string().optional(),
  terminal_name: z.string(),
  terminal_code: z.string().optional(),
  terminal_slug: z.string().optional(),
});

export type UEXCommodityPriceAll = z.infer<typeof UEXCommodityPriceAllObject>;

export async function listCommodities(): Promise<UEXListCommoditiesList> {
  const endpoint: UEXEndpoint = "commodities";
  const result = await queryUEX({
    endpoint,
    validationObject: UEXListCommoditiesResponseObject,
  });
  return result.data;
}

export const UEXCommodityPricesAllResponseObject = getValidationObject(
  UEXCommodityPriceAllObject
);

export type UEXCommodityPricesAllResponse = z.infer<
  typeof UEXCommodityPricesAllResponseObject
>;
export type UEXCommodityPricesAllList = z.infer<
  typeof UEXCommodityPriceAllObject
>[];

export const UEXCommodityPriceHistoryObject = z.object({
  id: z.number(),
  id_commodity: z.number(),
  id_star_system: z.number(),
  id_planet: z.number(),
  id_orbit: z.number(),
  id_moon: z.number(),
  id_city: z.number(),
  id_outpost: z.number(),
  id_poi: z.number(),
  id_terminal: z.number(),
  id_faction: z.number(),

  // Prices (per SCU)
  price_buy: z.number(),
  price_sell: z.number(),

  // Availability (SCU)
  scu_buy: z.number(),
  scu_sell_stock: z.number(),
  scu_sell: z.number(),

  // Inventory state
  status_buy: z.number(),
  status_sell: z.number(),

  // Other
  game_version: z.string(), // Note: API doc says int(11) but description suggests string
  date_added: z.number(),
  commodity_name: z.string(), // Note: API doc says int(11) but this should be string
  commodity_code: z.string(), // Note: API doc says int(11) but this should be string
  commodity_slug: z.string(), // Note: API doc says int(11) but this should be string
  star_system_name: z.string(), // Note: API doc says int(11) but this should be string
  planet_name: z.string(), // Note: API doc says int(11) but this should be string
  orbit_name: z.string(), // Note: API doc says int(11) but this should be string
  moon_name: z.string(), // Note: API doc says int(11) but this should be string
  space_station_name: z.string(), // Note: API doc says int(11) but this should be string
  outpost_name: z.string(), // Note: API doc says int(11) but this should be string
  city_name: z.string(), // Note: API doc says int(11) but this should be string
  faction_name: z.string().nullable(), // Note: API doc says int(11) but this should be string
  terminal_name: z.string(), // Note: API doc says int(11) but this should be string
  terminal_code: z.string(), // Note: API doc says int(11) but this should be string
  terminal_slug: z.string(), // Note: API doc says int(11) but this should be string
});

export type UEXCommodityPriceHistory = z.infer<
  typeof UEXCommodityPriceHistoryObject
>;

export const UEXCommodityPricesHistoryResponseObject = getValidationObject(
  UEXCommodityPriceHistoryObject
);

export type UEXCommodityPricesHistoryResponse = z.infer<
  typeof UEXCommodityPricesHistoryResponseObject
>;
export type UEXCommodityPricesHistoryList = z.infer<
  typeof UEXCommodityPriceHistoryObject
>[];

// Filter type for commodities prices history endpoint
export type CommodityPricesHistoryFilter = {
  id_terminal: number;
  id_commodity: number;
  game_version?: string;
};

export const UEXCommodityRankingObject = z.object({
  id: z.number(),
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  is_temporary: z.number(),
  price_buy_avg_month: z.number().optional(), // per SCU
  price_sell_avg_month: z.number().optional(), // per SCU
  scu_buy_avg_month: z.number().optional(),
  scu_sell_avg_month: z.number().optional(),
  status_buy_avg_month: z.number().optional(), // inventory level
  status_sell_avg_month: z.number().optional(), // inventory level
  volatility_buy: z.number().optional(), // price coefficient of variation. higher is worse
  volatility_sell: z.number().optional(), // price coefficient of variation. higher is worse
  cax_score: z.number(), // commodity score, higher is better
  investment: z.number(),
  investment_per_scu: z.number(),
  profitability: z.number(),
  profitability_relative_percentage: z.number(),
  profitability_per_scu: z.number(),
  availability_buy: z.number(), // number of locations buying
  availability_sell: z.number(), // number of locations selling
  price_buy_minimum: z.number().nullable().optional(), // lowest purchase price found
  price_sell_maximum: z.number().nullable(), // highest sell price found
  terminal_id_price_buy_minimum: z.number().nullable().optional(), // terminal ID with the lowest purchase price found
  terminal_slug_price_buy_minimum: z.string().nullable().optional(), // terminal slug with the lowest purchase price found
  terminal_id_price_sell_maximum: z.number().nullable(), // terminal ID with the highest sell price found
  terminal_slug_price_sell_maximum: z.string().nullable(), // terminal slug with the highest sell price found
});

export type UEXCommodityRanking = z.infer<typeof UEXCommodityRankingObject>;

export const UEXListCommodityRankingResponseObject = getValidationObject(
  UEXCommodityRankingObject
);

export type UEXListCommodityRankingResponse = z.infer<
  typeof UEXListCommodityRankingResponseObject
>;
export type UEXCommodityRankingList = z.infer<
  typeof UEXCommodityRankingObject
>[];

export const UEXCommodityRawPriceObject = z.object({
  id: z.number(),
  id_commodity: z.number(),
  id_star_system: z.number(),
  id_planet: z.number(),
  id_orbit: z.number(),
  id_moon: z.number(),
  id_city: z.number(),
  id_outpost: z.number(),
  id_poi: z.number(),
  id_terminal: z.number(),
  id_faction: z.number(),

  // Sell prices (per SCU)
  price_sell: z.number(), // last reported price
  price_sell_min: z.number(),
  price_sell_min_week: z.number(),
  price_sell_min_month: z.number(),
  price_sell_max: z.number(),
  price_sell_max_week: z.number(),
  price_sell_max_month: z.number(),
  price_sell_avg: z.number(),
  price_sell_avg_week: z.number(),
  price_sell_avg_month: z.number(),

  // Factions
  faction_affinity: z.number().optional(), // datarunner's affinity average at a location (from -100 to 100)

  // Other
  game_version: z.string(),
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  commodity_name: z.string(),
  commodity_code: z.string().optional(),
  commodity_slug: z.string().optional(),
  star_system_name: z.string(),
  planet_name: z.string(),
  orbit_name: z.string(),
  moon_name: z.string(),
  space_station_name: z.string(),
  outpost_name: z.string(),
  city_name: z.string(),
  faction_name: z.string().nullable(),
  terminal_name: z.string(), // Note: API doc says int(11) but this should be string
  terminal_code: z.string().optional(), // Note: API doc says int(11) but this should be string
  terminal_slug: z.string().optional(), // Note: API doc says int(11) but this should be string
  terminal_is_player_owned: z.number(),
});

export type UEXCommodityRawPrice = z.infer<typeof UEXCommodityRawPriceObject>;

export const UEXListCommodityRawPricesResponseObject = getValidationObject(
  UEXCommodityRawPriceObject
);

export type UEXListCommodityRawPricesResponse = z.infer<
  typeof UEXListCommodityRawPricesResponseObject
>;
export type UEXListCommodityRawPricesList = z.infer<
  typeof UEXCommodityRawPriceObject
>[];

export type CommodityRawPricesFilter = {
  id_terminal?: number | string; // Supports comma-separated list of up to 10 ids
  id_commodity?: number;
};

export const UEXCommodityRawPriceAllObject = z.object({
  id: z.number(),
  id_commodity: z.number(),
  id_terminal: z.number(),
  price_sell: z.number(), // last reported price per SCU
  price_sell_avg: z.number(), // average price per SCU
  date_added: z.number(), // timestamp, first time added
  date_modified: z.number(), // timestamp, last price update
  commodity_name: z.string(),
  commodity_code: z.string().optional(),
  commodity_slug: z.string().optional(),
  terminal_name: z.string(), // Note: API doc says int(11) but this should be string
  terminal_code: z.string().optional(), // Note: API doc says int(11) but this should be string
  terminal_slug: z.string().optional(), // Note: API doc says int(11) but this should be string
});

export type UEXCommodityRawPriceAll = z.infer<
  typeof UEXCommodityRawPriceAllObject
>;

export const UEXCommodityRawPricesAllResponseObject = getValidationObject(
  UEXCommodityRawPriceAllObject
);

export type UEXCommodityRawPricesAllResponse = z.infer<
  typeof UEXCommodityRawPricesAllResponseObject
>;
export type UEXCommodityRawPricesAllList = z.infer<
  typeof UEXCommodityRawPriceAllObject
>[];

export const UEXCommodityStatusObject = z.object({
  buy: z.array(
    z.object({
      code: z.number(),
      name: z.string(),
      name_short: z.string(),
      name_abbr: z.string(),
      percentage: z.string(),
      colors: z.string(),
    })
  ),
});

export type UEXCommodityStatus = z.infer<typeof UEXCommodityStatusObject>;

export const UEXCommodityStatusResponseObject = getValidationObject(
  UEXCommodityStatusObject
);

export type UEXCommodityStatusResponse = z.infer<
  typeof UEXCommodityStatusResponseObject
>;
