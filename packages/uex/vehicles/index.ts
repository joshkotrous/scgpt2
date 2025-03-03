import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  UEXVehicleLoanersList,
  UEXVehicleLoanersResponseObject,
  UEXVehiclePricesList,
  UEXVehiclePricesResponseObject,
  UEXVehiclePurchasePricesAllList,
  UEXVehiclePurchasePricesAllResponseObject,
  UEXVehiclePurchasePricesList,
  UEXVehiclePurchasePricesResponseObject,
  UEXVehicleRentalPricesAllList,
  UEXVehicleRentalPricesAllResponseObject,
  UEXVehicleRentalPricesList,
  UEXVehicleRentalPricesResponseObject,
  UEXVehiclesList,
  UEXVehiclesResponseObject,
  VehicleLoanersFilter,
  VehiclePricesFilter,
  VehiclePurchasePricesFilter,
  VehicleRentalPricesFilter,
  VehiclesFilter,
} from "./types";

/**
 * Get vehicles information from the UEX API
 * Retrieves a list of Star Citizen vehicles, including spaceships and ground vehicles
 * @param filter Optional filter to narrow results by manufacturer
 * @returns Vehicles data
 */
export async function listVehicles({
  filter = {},
}: {
  filter?: VehiclesFilter;
} = {}): Promise<UEXVehiclesList> {
  const endpoint: UEXEndpoint = "vehicles";

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXVehiclesResponseObject,
  });

  return result.data;
}

/**
 * Get vehicle loaners information from the UEX API
 * Retrieves a list of Star Citizen vehicles loaners for a specific vehicle
 * @param filter Filter to specify the vehicle by ID, UUID, or name
 * @returns Vehicle loaners data
 */
export async function getVehicleLoaners({
  filter,
}: {
  filter: VehicleLoanersFilter;
}): Promise<UEXVehicleLoanersList> {
  const endpoint: UEXEndpoint = "vehicles_loaners";

  if (!filter.id_vehicle && !filter.uuid && !filter.name) {
    throw new Error(
      "At least one of: id_vehicle, uuid, or name is required for the vehicles_loaners endpoint"
    );
  }

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXVehicleLoanersResponseObject,
  });

  return result.data;
}

/**
 * Get vehicle pledge store prices from the UEX API
 * Obtain a daily updated list of vehicle prices in CIG's pledge store
 * @param filter Filter to specify the vehicle by ID or UUID
 * @returns Vehicle pledge prices data
 */
export async function listVehiclePrices({
  filter = {},
}: {
  filter?: VehiclePricesFilter;
} = {}): Promise<UEXVehiclePricesList> {
  const endpoint: UEXEndpoint = "vehicles_prices";

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXVehiclePricesResponseObject,
  });

  return result.data;
}

/**
 * Get vehicle in-game purchase prices from the UEX API
 * Retrieve a list of in-game vehicle purchase prices
 * @param filter Filter to specify the vehicle by ID/UUID or terminal
 * @returns Vehicle purchase prices data
 */
export async function listVehiclePurchasePrices({
  filter,
}: {
  filter: VehiclePurchasePricesFilter;
}): Promise<UEXVehiclePurchasePricesList> {
  const endpoint: UEXEndpoint = "vehicles_purchases_prices";

  if (!filter.id_terminal && !filter.id_vehicle && !filter.uuid) {
    throw new Error(
      "At least one of: id_terminal, id_vehicle, or uuid is required for the vehicles_purchases_prices endpoint"
    );
  }

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXVehiclePurchasePricesResponseObject,
  });

  return result.data;
}

/**
 * Get all vehicle in-game purchase prices from the UEX API
 * Retrieve a list of prices for all vehicles purchases in all terminals, all at once
 * @returns All vehicle purchase prices data
 */
export async function listAllVehiclePurchasePrices(): Promise<UEXVehiclePurchasePricesAllList> {
  const endpoint: UEXEndpoint = "vehicles_purchases_prices_all";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXVehiclePurchasePricesAllResponseObject,
  });

  return result.data;
}

/**
 * Get vehicle in-game rental prices from the UEX API
 * Retrieve a list of in-game vehicle rental prices
 * @param filter Filter to specify the vehicle by ID/UUID or terminal
 * @returns Vehicle rental prices data
 */
export async function listVehicleRentalPrices({
  filter,
}: {
  filter: VehicleRentalPricesFilter;
}): Promise<UEXVehicleRentalPricesList> {
  const endpoint: UEXEndpoint = "vehicles_rentals_prices";

  if (!filter.id_terminal && !filter.id_vehicle && !filter.uuid) {
    throw new Error(
      "At least one of: id_terminal, id_vehicle, or uuid is required for the vehicles_rentals_prices endpoint"
    );
  }

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXVehicleRentalPricesResponseObject,
  });

  return result.data;
}

/**
 * Get all vehicle in-game rental prices from the UEX API
 * Retrieve a list of prices for all vehicles rentals in all terminals, all at once
 * @returns All vehicle rental prices data
 */
export async function listAllVehicleRentalPrices(): Promise<UEXVehicleRentalPricesAllList> {
  const endpoint: UEXEndpoint = "vehicles_rentals_prices_all";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXVehicleRentalPricesAllResponseObject,
  });

  return result.data;
}
