import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  FuelPricesFilter,
  UEXFuelPricesAllList,
  UEXFuelPricesAllResponseObject,
  UEXFuelPricesResponse,
  UEXFuelPricesResponseObject,
} from "./types";

/**
 * Get fuel prices information from the UEX API
 * At least one filter parameter is required
 * @param filter Filter parameters for the API call
 * @returns Fuel price data
 */
export async function listFuelPrices({
  filter,
}: {
  filter: FuelPricesFilter;
}): Promise<UEXFuelPricesResponse> {
  const endpoint: UEXEndpoint = "fuel_prices";

  if (!filter || Object.keys(filter).length === 0) {
    throw new Error(
      "At least one filter parameter is required for the fuel_prices endpoint"
    );
  }

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXFuelPricesResponseObject,
  });

  return result;
}

/**
 * Get all fuel prices from the UEX API
 * Retrieves a list of all fuel prices in all terminals, all at once
 * @returns All fuel price data
 */
export async function listAllFuelPrices(): Promise<UEXFuelPricesAllList> {
  const endpoint: UEXEndpoint = "fuel_prices_all";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXFuelPricesAllResponseObject,
  });

  return result.data;
}
