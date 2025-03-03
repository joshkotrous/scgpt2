import { z } from "zod";

// Define valid data extract types
export enum DataExtractType {
  COMMODITIES_ROUTES = "commodities_routes", // top 30 commodities routes according to UEX
  COMMODITIES_PRICES = "commodities_prices", // last commodities average prices
  LAST_COMMODITY_DATA_REPORTS = "last_commodity_data_reports", // last 30 commodities reports sent by Datarunners
}

// For data extract, we expect a plain text response
export const UEXDataExtractResponseObject = z.string();

export type UEXDataExtractResponse = z.infer<
  typeof UEXDataExtractResponseObject
>;
