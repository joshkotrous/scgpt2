import { getValidationObject } from "@uex/core";
import { z } from "zod";

// Define the schema for game versions information based on the API documentation
export const UEXGameVersionsObject = z.object({
  live: z.string(), // current live version, e.g. '4.0.2'
  ptu: z.string(), // current ptu versions, e.g. '4.0.2' or empty if there is no PTU set
});

export type UEXGameVersions = z.infer<typeof UEXGameVersionsObject>;

export const UEXGameVersionsResponseObject = getValidationObject(
  UEXGameVersionsObject
);
