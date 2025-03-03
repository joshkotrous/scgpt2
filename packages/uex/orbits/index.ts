import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  OrbitDistancesFilter,
  OrbitsFilter,
  UEXOrbitDistancesResponse,
  UEXOrbitDistancesResponseObject,
  UEXOrbitsList,
  UEXOrbitsResponseObject,
} from "./types";

/**
 * Get orbits information from the UEX API
 * Retrieves a list of orbits in the Star Citizen universe with optional filtering
 * @param filter Optional filter parameters to narrow results
 * @returns Orbits data
 */
export async function listOrbits({
  filter = {},
}: {
  filter?: OrbitsFilter;
} = {}): Promise<UEXOrbitsList> {
  const endpoint: UEXEndpoint = "orbits";

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXOrbitsResponseObject,
  });

  return result.data;
}

/**
 * Get orbit distances information from the UEX API
 * Obtain the last orbital distances reported by Datarunners
 * @param filter Filter parameters for the API call
 * @returns Orbit distances data
 */
export async function listOrbitDistances({
  filter,
}: {
  filter: OrbitDistancesFilter;
}): Promise<UEXOrbitDistancesResponse> {
  const endpoint: UEXEndpoint = "orbits_distances";

  if (!filter.id_star_system_origin || !filter.id_star_system_destination) {
    throw new Error(
      "Both star system origin and destination IDs are required for the orbits_distances endpoint"
    );
  }

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXOrbitDistancesResponseObject,
  });

  return result.data;
}
