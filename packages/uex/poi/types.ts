import { getValidationObject } from "@uex/core";
import { z } from "zod";

// Define the schema for POI information based on the API documentation
export const UEXPointOfInterestObject = z.object({
  id: z.number(),
  id_star_system: z.number(),
  id_planet: z.number(),
  id_orbit: z.number(),
  id_moon: z.number(),
  id_space_station: z.number(),
  id_city: z.number(),
  id_outpost: z.number(),
  id_faction: z.number(),
  id_jurisdiction: z.number(),
  name: z.string(),
  nickname: z.string(),
  is_available: z.number(), // UEX website
  is_available_live: z.number(), // Star Citizen (LIVE servers)
  is_visible: z.number(), // UEX website (visible to everyone)
  is_default: z.number(),
  is_monitored: z.number(),
  is_armistice: z.number(),
  is_landable: z.number(),
  is_decommissioned: z.number(),
  has_quantum_marker: z.number(),
  has_trade_terminal: z.number(),
  has_habitation: z.number(),
  has_refinery: z.number(),
  has_cargo_center: z.number(),
  has_clinic: z.number(),
  has_food: z.number(),
  has_shops: z.number(),
  has_refuel: z.number(),
  has_repair: z.number(),
  has_gravity: z.number(),
  has_loading_dock: z.number(),
  has_docking_port: z.number(),
  has_freight_elevator: z.number(),
  pad_types: z.string().nullable(), // XS, S, M, L, XL
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
  star_system_name: z.string(),
  planet_name: z.string(),
  orbit_name: z.string(),
  moon_name: z.string().nullable(),
  space_station_name: z.string().nullable(),
  outpost_name: z.string().nullable(),
  city_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});

export type UEXPointOfInterest = z.infer<typeof UEXPointOfInterestObject>;

export const UEXPointsOfInterestResponseObject = getValidationObject(
  UEXPointOfInterestObject
);

export type UEXPointsOfInterestResponse = z.infer<
  typeof UEXPointsOfInterestResponseObject
>;
export type UEXPointsOfInterestList = z.infer<
  typeof UEXPointOfInterestObject
>[];

// Filter type for POI endpoint
export type PointsOfInterestFilter = {
  id_star_system?: number;
  id_faction?: number;
  id_jurisdiction?: number;
  id_planet?: number;
  id_orbit?: number;
  id_moon?: number;
  id_space_station?: number;
  id_city?: number;
  id_outpost?: number;
};
