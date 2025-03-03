import { getValidationObject } from "@uex/core";
import { z } from "zod";

// Define the schema for jurisdiction information based on the API documentation
export const UEXJurisdictionObject = z.object({
  id: z.number(),
  id_faction: z.number(), // comma separated
  name: z.string(),
  nickname: z.string(),
  is_available: z.number(), // UEX website
  is_available_live: z.number(), // Star Citizen (LIVE servers)
  is_visible: z.number(), // UEX website (visible to everyone)
  is_default: z.number(),
  wiki: z.string(), // wiki page
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
  faction_name: z.string().nullable(),
});

export type UEXJurisdiction = z.infer<typeof UEXJurisdictionObject>;

export const UEXJurisdictionsResponseObject = getValidationObject(
  UEXJurisdictionObject
);

export type UEXJurisdictionsResponse = z.infer<
  typeof UEXJurisdictionsResponseObject
>;
export type UEXJurisdictionsList = z.infer<typeof UEXJurisdictionObject>[];
