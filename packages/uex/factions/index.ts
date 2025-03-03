import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import { UEXFactionsList, UEXFactionsResponseObject } from "./types";

/**
 * Get all factions information from the UEX API
 * Retrieves a list of all factions in the Star Citizen universe
 * @returns Factions data
 */
export async function listAllFactions(): Promise<UEXFactionsList> {
  const endpoint: UEXEndpoint = "factions";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXFactionsResponseObject,
  });

  return result.data;
}
