import { queryUEX } from "../core";
import { UEXEndpoint } from "../core";
import {
  DataExtractType,
  UEXDataExtractResponse,
  UEXDataExtractResponseObject,
} from "./types";

/**
 * Get data extract information from the UEX API
 * Retrieves formatted text data for different data types
 *
 * @param dataType Type of data to extract
 * @returns Formatted text data as a string
 */
export async function getDataExtract(
  dataType: DataExtractType
): Promise<UEXDataExtractResponse> {
  const endpoint: UEXEndpoint = "data_extract";

  const result = await queryUEX({
    endpoint,
    queryParams: { data: dataType },
    validationObject: UEXDataExtractResponseObject,
  });

  return result;
}
