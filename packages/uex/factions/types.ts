import { getValidationObject } from "@uex/core";
import { z } from "zod";

// Define the schema for faction information based on the API documentation
export const UEXFactionObject = z.object({
  id: z.number(),
  ids_star_systems: z.string(), // comma separated
  ids_factions_friendly: z.string().nullable(), // comma separated
  ids_factions_hostile: z.string().nullable(), // comma separated
  name: z.string(),
  wiki: z.string(), // wiki page
  is_piracy: z.number(), // is related to piracy
  is_bounty_hunting: z.number(), // is related to bounty hunting
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
});

export type UEXFaction = z.infer<typeof UEXFactionObject>;

export const UEXFactionsResponseObject = getValidationObject(UEXFactionObject);

export type UEXFactionsResponse = z.infer<typeof UEXFactionsResponseObject>;
export type UEXFactionsList = z.infer<typeof UEXFactionObject>[];
