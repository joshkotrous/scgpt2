import { getValidationObject } from "@uex/core";
import { z } from "zod";

// 1. Define the schema for orbit information
export const UEXOrbitObject = z.object({
  id: z.number(),
  id_star_system: z.number(),
  id_faction: z.number(),
  id_jurisdiction: z.number(),
  name: z.string(),
  name_origin: z.string(), // discovery name
  code: z.string(), // UEX code
  is_available: z.number(), // UEX website
  is_available_live: z.number(), // Star Citizen (LIVE servers)
  is_visible: z.number(), // UEX website (visible to everyone)
  is_default: z.number(),
  is_lagrange: z.number(),
  is_man_made: z.number(),
  is_asteroid: z.number(),
  is_planet: z.number(),
  is_star: z.number(),
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
  star_system_name: z.string(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});

export type UEXOrbit = z.infer<typeof UEXOrbitObject>;

export const UEXOrbitsResponseObject = getValidationObject(UEXOrbitObject);

export type UEXOrbitsResponse = z.infer<typeof UEXOrbitsResponseObject>;
export type UEXOrbitsList = z.infer<typeof UEXOrbitObject>[];

// 2. Define the schema for orbit distances
export const UEXOrbitDistanceObject = z.object({
  id: z.number(),
  // id_star_system field removed as noted in documentation (deprecated)
  id_star_system_origin: z.number(),
  id_star_system_destination: z.number(),
  id_orbit_origin: z.number(),
  id_orbit_destination: z.number(),
  distance: z.number(), // value in Giga Meters (GM)
  game_version: z.string(),
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
  star_system_name: z.string(),
  orbit_origin_name: z.string(),
  orbit_destination_name: z.string(),
});

export type UEXOrbitDistance = z.infer<typeof UEXOrbitDistanceObject>;

export const UEXOrbitDistancesResponseObject = getValidationObject(
  UEXOrbitDistanceObject
);

export type UEXOrbitDistancesResponse = z.infer<
  typeof UEXOrbitDistancesResponseObject
>;
export type UEXOrbitDistancesList = z.infer<typeof UEXOrbitDistanceObject>[];

// Filter types for the orbits endpoint
export type OrbitsFilter = {
  id_star_system?: number;
  id_faction?: number;
  id_jurisdiction?: number;
  is_lagrange?: number;
};

// Filter types for the orbits_distances endpoint
export type OrbitDistancesFilter = {
  id_star_system_origin: number;
  id_star_system_destination: number;
  id_orbit_origin?: number;
  id_orbit_destination?: number;
};
