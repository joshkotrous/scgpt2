import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "@uex/core";
import { UEXGameVersions, UEXGameVersionsResponseObject } from "./types";

/**
 * Get current game versions information from the UEX API
 * Retrieves information about current live and PTU versions of Star Citizen
 * @returns Game versions data
 */
export async function listGameVersions(): Promise<UEXGameVersions> {
  const endpoint: UEXEndpoint = "game_versions";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXGameVersionsResponseObject,
  });

  return result.data;
}
