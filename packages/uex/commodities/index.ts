import { z } from "zod";
import { queryUEX, getValidationObject } from "../core";
import { UEXEndpoint } from "../core";
import {
  CommodityPricesFilter,
  CommodityPricesHistoryFilter,
  CommodityRawPricesFilter,
  UEXCommodityAverageList,
  UEXCommodityPricesAllList,
  UEXCommodityPricesAllResponseObject,
  UEXCommodityPricesHistoryList,
  UEXCommodityPricesHistoryResponseObject,
  UEXCommodityPricesResponse,
  UEXCommodityPricesResponseObject,
  UEXCommodityRankingList,
  UEXCommodityRawPricesAllList,
  UEXCommodityRawPricesAllResponseObject,
  UEXCommodityStatus,
  UEXCommodityStatusResponseObject,
  UEXListCommoditiesList,
  UEXListCommoditiesResponseObject,
  UEXListCommodityAveragesResponseObject,
  UEXListCommodityRankingResponseObject,
  UEXListCommodityRawPricesList,
  UEXListCommodityRawPricesResponseObject,
} from "./types";

export async function listCommoditiesAlerts({
  filter,
}: {
  filter?: { commodityId: number };
}) {}

export async function listCommodities(): Promise<UEXListCommoditiesList> {
  const endpoint: UEXEndpoint = "commodities";
  const result = await queryUEX({
    endpoint,
    validationObject: UEXListCommoditiesResponseObject,
  });
  return result.data;
}
export async function listCommoditiesAverages({
  filter,
}: {
  filter: { commodityId: number };
}): Promise<UEXCommodityAverageList> {
  const endpoint: UEXEndpoint = "commodities_averages";
  const result = await queryUEX({
    endpoint,
    queryParams: { id_commodity: filter.commodityId },
    validationObject: UEXListCommodityAveragesResponseObject,
  });
  return result.data;
}

export async function listCommoditiesPrices({
  filter,
}: {
  filter: CommodityPricesFilter;
}): Promise<UEXCommodityPricesResponse> {
  const endpoint: UEXEndpoint = "commodities_prices";

  if (!filter || Object.keys(filter).length === 0) {
    throw new Error(
      "At least one filter parameter is required for the commodities_prices endpoint"
    );
  }

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXCommodityPricesResponseObject,
  });

  return result;
}

export async function listAllCommoditiesPrices(): Promise<UEXCommodityPricesAllList> {
  const endpoint: UEXEndpoint = "commodities_prices_all";
  const result = await queryUEX({
    endpoint,
    validationObject: UEXCommodityPricesAllResponseObject,
  });
  return result.data;
}

export async function listCommoditiesPricesHistory({
  filter,
}: {
  filter: CommodityPricesHistoryFilter;
}): Promise<UEXCommodityPricesHistoryList> {
  const endpoint: UEXEndpoint = "commodities_prices_history";

  if (!filter.id_terminal) {
    throw new Error(
      "Terminal ID (id_terminal) is required for the commodities_prices_history endpoint"
    );
  }

  if (!filter.id_commodity) {
    throw new Error(
      "Commodity ID (id_commodity) is required for the commodities_prices_history endpoint"
    );
  }

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXCommodityPricesHistoryResponseObject,
  });

  return result.data;
}

export async function listCommoditiesRanking(): Promise<UEXCommodityRankingList> {
  const endpoint: UEXEndpoint = "commodities_ranking";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXListCommodityRankingResponseObject,
  });

  return result.data;
}

export async function listCommoditiesRawPrices({
  filter,
}: {
  filter: CommodityRawPricesFilter;
}): Promise<UEXListCommodityRawPricesList> {
  const endpoint: UEXEndpoint = "commodities_raw_prices";

  if (!filter.id_terminal && !filter.id_commodity) {
    throw new Error(
      "Either Terminal ID (id_terminal) or Commodity ID (id_commodity) is required for the commodities_raw_prices endpoint"
    );
  }

  const result = await queryUEX({
    endpoint,
    queryParams: filter,
    validationObject: UEXListCommodityRawPricesResponseObject,
  });

  return result.data;
}

export async function listAllCommoditiesRawPrices(): Promise<UEXCommodityRawPricesAllList> {
  const endpoint: UEXEndpoint = "commodities_raw_prices_all";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXCommodityRawPricesAllResponseObject,
  });

  return result.data;
}

export async function listCommoditiesStatus(): Promise<UEXCommodityStatus> {
  const endpoint: UEXEndpoint = "commodities_status";

  const result = await queryUEX({
    endpoint,
    validationObject: UEXCommodityStatusResponseObject,
  });

  return result.data;
}
