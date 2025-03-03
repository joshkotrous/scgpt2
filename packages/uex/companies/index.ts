import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  CompaniesFilter,
  UEXCompaniesList,
  UEXCompaniesResponseObject,
} from "./types";

/**
 * Get companies information from the UEX API
 * Retrieves a list of all companies in the Star Citizen universe
 * @param filter Optional filter parameters to narrow results
 * @returns Companies data
 */
export async function listAllCompanies({
  filter = {},
}: {
  filter?: CompaniesFilter;
} = {}): Promise<UEXCompaniesList> {
  const endpoint: UEXEndpoint = "companies";

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXCompaniesResponseObject,
  });

  return result.data;
}
