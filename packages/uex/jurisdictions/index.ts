import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import { UEXJurisdictionsList, UEXJurisdictionsResponseObject } from "./types";

/**
 * Get all jurisdictions information from the UEX API
 * Retrieves a list of all jurisdictions in the Star Citizen universe
 * @returns Jurisdictions data
 */
export async function listAllJurisdictions(): Promise<UEXJurisdictionsList> {
  const endpoint: UEXEndpoint = "jurisdictions";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXJurisdictionsResponseObject,
  });

  return result.data;
}
