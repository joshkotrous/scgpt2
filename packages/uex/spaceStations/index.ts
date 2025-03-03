import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  SpaceStationsFilter,
  UEXSpaceStationsList,
  UEXSpaceStationsResponseObject,
} from "./types";

/**
 * Get space stations information from the UEX API
 * Retrieves a list of space stations in the Star Citizen universe with optional filtering
 * @param filter Optional filter parameters to narrow results
 * @returns Space stations data
 */
export async function listSpaceStations({
  filter = {},
}: {
  filter?: SpaceStationsFilter;
} = {}): Promise<UEXSpaceStationsList> {
  const endpoint: UEXEndpoint = "space_stations";

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXSpaceStationsResponseObject,
  });

  return result.data;
}
