import { getValidationObject } from "@uex/core";
import { z } from "zod";

// Define the schema for planet information based on the API documentation
export const UEXPlanetObject = z.object({
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
  is_lagrange: z.number().optional(),
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
  star_system_name: z.string(),
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});

export type UEXPlanet = z.infer<typeof UEXPlanetObject>;

export const UEXPlanetsResponseObject = getValidationObject(UEXPlanetObject);

export type UEXPlanetsResponse = z.infer<typeof UEXPlanetsResponseObject>;
export type UEXPlanetsList = z.infer<typeof UEXPlanetObject>[];

// Filter type for planets endpoint
export type PlanetsFilter = {
  id_star_system?: number;
  id_faction?: number;
  id_jurisdiction?: number;
  is_lagrange?: number;
};
