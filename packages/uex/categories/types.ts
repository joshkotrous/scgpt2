import { getValidationObject } from "@uex/core";
import { z } from "zod";

export const UEXCategoryObject = z.object({
  id: z.number(),
  type: z.string(),
  section: z.string(),
  name: z.string(),
  is_game_related: z.number(),
  is_mining: z.number(),
  date_added: z.number(),
  date_modified: z.number(),
});

export const UEXCategoryAttributesObject = z.object({
  id: z.number(),
  id_category: z.number(),
  name: z.string(),
  category_name: z.string(),
  date_added: z.number(),
  date_modified: z.number(),
});

export const UEXCategoryResponseObject = getValidationObject(UEXCategoryObject);

export const UEXCategoryAttributesResponseObject = getValidationObject(
  UEXCategoryAttributesObject
);

export type UEXCategoryResponse = z.infer<typeof UEXCategoryResponseObject>;
export type UEXCategoryList = z.infer<typeof UEXCategoryObject>[];
export type UEXCategoryAttributesResponse = z.infer<
  typeof UEXCategoryAttributesResponseObject
>;
export type UEXCategoryAttributesList = z.infer<
  typeof UEXCategoryAttributesObject
>[];
