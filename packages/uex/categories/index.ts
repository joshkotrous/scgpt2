import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  UEXCategoryAttributesResponse,
  UEXCategoryAttributesResponseObject,
  UEXCategoryList,
  UEXCategoryResponseObject,
} from "./types";

export async function listCategories({
  filter,
}: {
  filter?: { type?: string; section?: string };
} = {}): Promise<UEXCategoryList> {
  const endpoint: UEXEndpoint = "categories";

  const queryParams: Record<string, string> = {};

  if (filter?.type) {
    queryParams.type = filter.type;
  }

  if (filter?.section) {
    queryParams.section = filter.section;
  }

  const result = await queryUEX({
    endpoint,
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    validationObject: UEXCategoryResponseObject,
    logResult: true,
  });

  return result.data;
}

export async function listCategoriesAttributes({
  filter,
}: {
  filter?: { categoryId?: number };
} = {}): Promise<UEXCategoryAttributesResponse> {
  const endpoint: UEXEndpoint = "categories_attributes";

  const queryParams: Record<string, string> = {};

  if (filter?.categoryId !== undefined) {
    queryParams.id_category = String(filter.categoryId);
  }

  const result = await queryUEX({
    endpoint,
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    validationObject: UEXCategoryAttributesResponseObject,
  });

  return result.data;
}
