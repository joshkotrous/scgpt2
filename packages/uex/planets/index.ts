import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  PlanetsFilter,
  UEXPlanetsList,
  UEXPlanetsResponseObject,
} from "./types";

/**
 * Get planets information from the UEX API
 * Retrieves a list of planets in the Star Citizen universe with optional filtering
 * @param filter Optional filter parameters to narrow results
 * @returns Planets data
 */
export async function listPlanets({
  filter = {},
}: {
  filter?: PlanetsFilter;
} = {}): Promise<UEXPlanetsList> {
  const endpoint: UEXEndpoint = "planets";

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXPlanetsResponseObject,
  });

  return result.data;
}
