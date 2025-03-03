import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import { UEXStarSystemsList, UEXStarSystemsResponseObject } from "./types";

/**
 * Get star systems information from the UEX API
 * Retrieves a list of all star systems in the Star Citizen universe
 * @returns Star systems data
 */
export async function listStarSystems(): Promise<UEXStarSystemsList> {
  const endpoint: UEXEndpoint = "star_systems";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXStarSystemsResponseObject,
  });

  return result.data;
}
