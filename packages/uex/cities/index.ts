import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import { UEXCityResponse, UEXCityResponseObject } from "./types";

export async function listCities({
  filter,
}: {
  filter?: {
    starSystemId?: number;
    factionId?: number;
    jurisdictionId?: number;
    planetId?: number;
    orbitId?: number;
    moonId?: number;
  };
} = {}): Promise<UEXCityResponse> {
  const endpoint: UEXEndpoint = "cities";

  const queryParams: Record<string, string> = {};

  if (filter?.starSystemId !== undefined) {
    queryParams.id_star_system = String(filter.starSystemId);
  }

  if (filter?.factionId !== undefined) {
    queryParams.id_faction = String(filter.factionId);
  }

  if (filter?.jurisdictionId !== undefined) {
    queryParams.id_jurisdiction = String(filter.jurisdictionId);
  }

  if (filter?.planetId !== undefined) {
    queryParams.id_planet = String(filter.planetId);
  }

  if (filter?.orbitId !== undefined) {
    queryParams.id_orbit = String(filter.orbitId);
  }

  if (filter?.moonId !== undefined) {
    queryParams.id_moon = String(filter.moonId);
  }

  const result = await queryUEX({
    endpoint,
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    validationObject: UEXCityResponseObject,
  });

  return result;
}
