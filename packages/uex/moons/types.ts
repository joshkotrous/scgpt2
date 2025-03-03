import { getValidationObject } from "@uex/core";
import { z } from "zod";

// Define the schema for moon information based on the API documentation
export const UEXMoonObject = z.object({
  id: z.number(),
  id_star_system: z.number(),
  id_planet: z.number(),
  id_orbit: z.number(),
  id_faction: z.number(),
  id_jurisdiction: z.number(),
  name: z.string(),
  name_origin: z.string(), // first moon names
  code: z.string(), // UEX code
  is_available: z.number(), // UEX website
  is_available_live: z.number(), // Star Citizen (LIVE servers)
  is_visible: z.number(), // UEX website (visible to everyone)
  is_default: z.number(),
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
  star_system_name: z.string(),
  planet_name: z.string(),
  orbit_name: z.string(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});

export type UEXMoon = z.infer<typeof UEXMoonObject>;

export const UEXMoonsResponseObject = getValidationObject(UEXMoonObject);

export type UEXMoonsResponse = z.infer<typeof UEXMoonsResponseObject>;
export type UEXMoonsList = z.infer<typeof UEXMoonObject>[];

// Filter type for moons endpoint
export type MoonsFilter = {
  id_star_system?: number;
  id_faction?: number;
  id_jurisdiction?: number;
  id_planet?: number;
};
