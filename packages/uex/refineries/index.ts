import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  UEXRefineryAuditsList,
  UEXRefineryAuditsResponseObject,
  UEXRefineryCapacitiesList,
  UEXRefineryCapacitiesResponseObject,
  UEXRefineryMethodsList,
  UEXRefineryMethodsResponseObject,
  UEXRefineryYieldsList,
  UEXRefineryYieldsResponseObject,
} from "./types";

/**
 * Get refinery audits information from the UEX API
 * Retrieves historical data about refinery operations
 * @returns Refinery audits data (maximum 500 rows)
 */
export async function listRefineryAudits(): Promise<UEXRefineryAuditsList> {
  const endpoint: UEXEndpoint = "refineries_audits";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXRefineryAuditsResponseObject,
  });

  return result.data;
}

/**
 * Get refinery capacities information from the UEX API
 * Retrieves a list of the estimated capacity percentages for all refineries
 * @returns Refinery capacities data (maximum 500 rows)
 */
export async function listRefineryCapacities(): Promise<UEXRefineryCapacitiesList> {
  const endpoint: UEXEndpoint = "refineries_capacities";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXRefineryCapacitiesResponseObject,
  });

  return result.data;
}

/**
 * Get refining methods information from the UEX API
 * Retrieves a list of the refining methods used by all in-game refineries
 * @returns Refining methods data (maximum 500 rows)
 */
export async function listRefineryMethods(): Promise<UEXRefineryMethodsList> {
  const endpoint: UEXEndpoint = "refineries_methods";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXRefineryMethodsResponseObject,
  });

  return result.data;
}

/**
 * Get refinery yields information from the UEX API
 * Retrieves a list of all refineries yields bonuses per commodity
 * @returns Refinery yields data (maximum 500 rows)
 */
export async function listRefineryYields(): Promise<UEXRefineryYieldsList> {
  const endpoint: UEXEndpoint = "refineries_yields";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXRefineryYieldsResponseObject,
  });

  return result.data;
}
