import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import { MoonsFilter, UEXMoonsList, UEXMoonsResponseObject } from "./types";

/**
 * Get moons information from the UEX API
 * Retrieves a list of moons in the Star Citizen universe with optional filtering
 * @param filter Optional filter parameters to narrow results
 * @returns Moons data
 */
export async function listMoons({
  filter = {},
}: {
  filter?: MoonsFilter;
} = {}): Promise<UEXMoonsList> {
  const endpoint: UEXEndpoint = "moons";

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXMoonsResponseObject,
  });

  return result.data;
}
