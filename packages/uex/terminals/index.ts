import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  TerminalDistancesFilter,
  TerminalsFilter,
  UEXTerminalDistance,
  UEXTerminalDistanceObject,
  UEXTerminalsList,
  UEXTerminalsResponseObject,
} from "./types";

/**
 * Get terminals information from the UEX API
 * Retrieves a list of trading terminals in the Star Citizen universe with optional filtering
 * @param filter Optional filter parameters to narrow results
 * @returns Terminals data
 */
export async function listTerminals({
  filter = {},
}: {
  filter?: TerminalsFilter;
} = {}): Promise<UEXTerminalsList> {
  const endpoint: UEXEndpoint = "terminals";

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXTerminalsResponseObject,
  });

  return result.data;
}

/**
 * Get terminal distance information from the UEX API
 * Estimates the distance (in gigameters) between two terminals within the Star Citizen universe
 * @param filter Required parameters specifying origin and destination terminals
 * @returns Terminal distance data
 */
export async function getTerminalDistance({
  filter,
}: {
  filter: TerminalDistancesFilter;
}): Promise<UEXTerminalDistance> {
  const endpoint: UEXEndpoint = "terminals_distances";

  if (!filter.id_terminal_origin) {
    throw new Error("Origin terminal ID (id_terminal_origin) is required");
  }

  if (!filter.id_terminal_destination) {
    throw new Error(
      "Destination terminal ID (id_terminal_destination) is required"
    );
  }

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXTerminalDistanceObject,
  });

  return result;
}
