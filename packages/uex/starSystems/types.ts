import { getValidationObject } from "@uex/core";
import { z } from "zod";

// Define the schema for star system information based on the API documentation
export const UEXStarSystemObject = z.object({
  id: z.number(),
  id_faction: z.number(),
  id_jurisdiction: z.number(),
  name: z.string(),
  code: z.string(), // UEX code
  is_available: z.number(), // UEX website
  is_available_live: z.number(), // Star Citizen (LIVE servers)
  is_visible: z.number(), // UEX website (visible to everyone)
  is_default: z.number(),
  wiki: z.string(), // Wiki URL
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
  faction_name: z.string().nullable(),
  jurisdiction_name: z.string().nullable(),
});

export type UEXStarSystem = z.infer<typeof UEXStarSystemObject>;

export const UEXStarSystemsResponseObject =
  getValidationObject(UEXStarSystemObject);

export type UEXStarSystemsResponse = z.infer<
  typeof UEXStarSystemsResponseObject
>;

export type UEXStarSystemsList = z.infer<typeof UEXStarSystemObject>[];
