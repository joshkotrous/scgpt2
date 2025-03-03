import { getValidationObject } from "@uex/core";
import { z } from "zod";

// Define the schema for space station information based on the API documentation
export const UEXSpaceStationObject = z.object({
  id: z.number(),
  id_star_system: z.number(),
  id_planet: z.number(),
  id_orbit: z.number(),
  id_moon: z.number(),
  id_city: z.number(), // city next to space station
  id_faction: z.number(),
  id_jurisdiction: z.number(),
  name: z.string(),
  nickname: z.string(), // UEX nickname
  is_available: z.number(), // UEX website
  is_available_live: z.number(), // Star Citizen (LIVE servers)
  is_visible: z.number(), // UEX website (visible to everyone)
  is_default: z.number(),
  is_monitored: z.number(),
  is_armistice: z.number(),
  is_landable: z.number(),
  is_decommissioned: z.number(),
  is_lagrange: z.number(),
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
  planet_name: z.string().nullable(),
  orbit_name: z.string(),
  city_name: z.string().nullable(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});

export type UEXSpaceStation = z.infer<typeof UEXSpaceStationObject>;

export const UEXSpaceStationsResponseObject = getValidationObject(
  UEXSpaceStationObject
);

export type UEXSpaceStationsResponse = z.infer<
  typeof UEXSpaceStationsResponseObject
>;
export type UEXSpaceStationsList = z.infer<typeof UEXSpaceStationObject>[];

// Filter type for space stations endpoint
export type SpaceStationsFilter = {
  id_star_system?: number;
  id_faction?: number;
  id_jurisdiction?: number;
  id_planet?: number;
  id_orbit?: number;
  id_moon?: number;
  id_city?: number;
};
