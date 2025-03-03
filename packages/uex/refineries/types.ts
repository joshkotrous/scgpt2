import { getValidationObject } from "@uex/core";
import { z } from "zod";

// 1. Define schema for refineries audits
export const UEXRefineryAuditObject = z.object({
  id: z.number(),
  id_commodity: z.number().nullable().optional(),
  id_star_system: z.number(),
  id_planet: z.number(),
  id_orbit: z.number(),
  id_moon: z.number(),
  id_city: z.number(),
  id_outpost: z.number(),
  id_poi: z.number(),
  id_faction: z.number().nullable().optional(),
  id_terminal: z.number(),
  yield: z.number(), // percentage of material specialization yield at refinery
  capacity: z.number(), // refinery capacity in percent
  method: z.string(), // refining method
  quantity: z.number(), // amount to be refined
  quantity_yield: z.number(), // amount yield
  quantity_inert: z.number(), // amount of inert materials
  total_cost: z.number(), // refining total cost
  total_time: z.number(), // refining total time in minutes
  date_added: z.number(), // timestamp
  date_reported: z.number(), // timestamp
  game_version: z.string(),
  datarunner: z.string(), // datarunner ign
  commodity_name: z.string(),
  star_system_name: z.string(),
  planet_name: z.string().nullable(),
  orbit_name: z.string(),
  moon_name: z.string().nullable(),
  space_station_name: z.string(),
  city_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  terminal_name: z.string(),
});

export type UEXRefineryAudit = z.infer<typeof UEXRefineryAuditObject>;

export const UEXRefineryAuditsResponseObject = getValidationObject(
  UEXRefineryAuditObject
);

export type UEXRefineryAuditsResponse = z.infer<
  typeof UEXRefineryAuditsResponseObject
>;
export type UEXRefineryAuditsList = z.infer<typeof UEXRefineryAuditObject>[];

// 2. Define schema for refineries capacities
export const UEXRefineryCapacityObject = z.object({
  id: z.number(),
  id_commodity: z.number().nullable().optional(),
  id_star_system: z.number(),
  id_planet: z.number(),
  id_orbit: z.number(),
  id_moon: z.number(),
  id_city: z.number(),
  id_outpost: z.number(),
  id_poi: z.number(),
  id_faction: z.number().nullable().optional(),
  id_terminal: z.number(),
  value: z.number(), // percentage of yield bonus at refinery
  value_week: z.number(), // percentage of yield bonus at refinery in the last 7 days
  value_month: z.number(), // percentage of yield bonus at refinery in the last 30 days
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
  star_system_name: z.string(),
  planet_name: z.string().nullable(),
  orbit_name: z.string(),
  moon_name: z.string().nullable(),
  space_station_name: z.string(),
  city_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  terminal_name: z.string(),
});

export type UEXRefineryCapacity = z.infer<typeof UEXRefineryCapacityObject>;

export const UEXRefineryCapacitiesResponseObject = getValidationObject(
  UEXRefineryCapacityObject
);

export type UEXRefineryCapacitiesResponse = z.infer<
  typeof UEXRefineryCapacitiesResponseObject
>;
export type UEXRefineryCapacitiesList = z.infer<
  typeof UEXRefineryCapacityObject
>[];

// 3. Define schema for refineries methods
export const UEXRefineryMethodObject = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  rating_yield: z.number(), // '1' to low, '2' to medium, '3' to high
  rating_cost: z.number(), // '1' to low, '2' to medium, '3' to high
  rating_speed: z.number(), // '1' to slow, '2' to medium, '3' to fast
  date_added: z.number(), // timestamp
  date_modified: z.number().optional(), // timestamp
});

export type UEXRefineryMethod = z.infer<typeof UEXRefineryMethodObject>;

export const UEXRefineryMethodsResponseObject = getValidationObject(
  UEXRefineryMethodObject
);

export type UEXRefineryMethodsResponse = z.infer<
  typeof UEXRefineryMethodsResponseObject
>;

export type UEXRefineryMethodsList = z.infer<typeof UEXRefineryMethodObject>[];

// 4. Define schema for refineries yields
export const UEXRefineryYieldObject = z.object({
  id: z.number(),
  id_commodity: z.number().nullable().optional(),
  id_star_system: z.number(),
  id_planet: z.number(),
  id_orbit: z.number(),
  id_moon: z.number(),
  id_city: z.number(),
  id_outpost: z.number(),
  id_poi: z.number(),
  id_faction: z.number().nullable().optional(),
  id_terminal: z.number(),
  value: z.number(), // percentage of yield bonus at refinery
  value_week: z.number(), // percentage of yield bonus at refinery (last 7 days)
  value_month: z.number(), // percentage of yield bonus at refinery (last 30 days)
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
  commodity_name: z.string(),
  star_system_name: z.string(),
  planet_name: z.string().nullable(),
  orbit_name: z.string(),
  moon_name: z.string().nullable(),
  space_station_name: z.string(),
  city_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  terminal_name: z.string(),
});

export type UEXRefineryYield = z.infer<typeof UEXRefineryYieldObject>;

export const UEXRefineryYieldsResponseObject = getValidationObject(
  UEXRefineryYieldObject
);

export type UEXRefineryYieldsResponse = z.infer<
  typeof UEXRefineryYieldsResponseObject
>;
export type UEXRefineryYieldsList = z.infer<typeof UEXRefineryYieldObject>[];
