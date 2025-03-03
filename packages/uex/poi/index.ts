import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  PointsOfInterestFilter,
  UEXPointsOfInterestList,
  UEXPointsOfInterestResponseObject,
} from "./types";

/**
 * Get points of interest information from the UEX API
 * Retrieves a list of points of interest in the Star Citizen universe with optional filtering
 * @param filter Optional filter parameters to narrow results
 * @returns Points of interest data
 */
export async function listPointsOfInterest({
  filter = {},
}: {
  filter?: PointsOfInterestFilter;
} = {}): Promise<UEXPointsOfInterestList> {
  const endpoint: UEXEndpoint = "poi";

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXPointsOfInterestResponseObject,
  });

  return result.data;
}
