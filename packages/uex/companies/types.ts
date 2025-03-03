import { getValidationObject } from "@uex/core";
import { z } from "zod";

export const UEXCompanyObject = z.object({
  id: z.number(),
  id_faction: z.number().optional(),
  name: z.string(),
  nickname: z.string(),
  wiki: z.string().nullable(),
  industry: z.string().nullable(), // main activity
  is_item_manufacturer: z.number(),
  is_vehicle_manufacturer: z.number(),
  date_added: z.number(), // timestamp
  date_modified: z.number(), // timestamp
});

export type UEXCompany = z.infer<typeof UEXCompanyObject>;

export const UEXCompaniesResponseObject = getValidationObject(UEXCompanyObject);

export type UEXCompaniesResponse = z.infer<typeof UEXCompaniesResponseObject>;
export type UEXCompaniesList = z.infer<typeof UEXCompanyObject>[];

export type CompaniesFilter = {
  is_item_manufacturer?: number; // show only item manufacturers
  is_vehicle_manufacturer?: number; // show only vehicle manufacturers
};
