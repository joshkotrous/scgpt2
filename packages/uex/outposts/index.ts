import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  OutpostsFilter,
  UEXOutpostsList,
  UEXOutpostsResponseObject,
} from "./types";

/**
 * Get outposts information from the UEX API
 * Retrieves a list of outposts in the Star Citizen universe with optional filtering
 * @param filter Optional filter parameters to narrow results
 * @returns Outposts data
 */
export async function listOutposts({
  filter = {},
}: {
  filter?: OutpostsFilter;
} = {}): Promise<UEXOutpostsList> {
  const endpoint: UEXEndpoint = "outposts";

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXOutpostsResponseObject,
  });

  return result.data;
}
