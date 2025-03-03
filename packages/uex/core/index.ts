import { z, ZodError } from "zod";

const UEX_API_URL = "https://api.uexcorp.space/2.0/";

const UEXEndpointObject = z.enum([
  "categories",
  "categories_attributes",
  "cities",
  "commodities",
  "commodities_alerts",
  "commodities_averages",
  "commodities_prices",
  "commodities_prices_history",
  "commodities_ranking",
  "commodities_prices_all",
  "commodities_raw_prices",
  "commodities_raw_prices_all",
  "commodities_routes",
  "commodities_status",
  "companies",
  "crew",
  "data_extract",
  "data_parameters",
  "factions",
  "fleet",
  "fuel_prices",
  "fuel_prices_all",
  "game_versions",
  "items",
  "items_attributes",
  "items_prices",
  "items_prices_all",
  "jurisdictions",
  "marketplace_favorites",
  "marketplace_listings",
  "moons",
  "orbits",
  "orbits_distances",
  "organizations",
  "outposts",
  "planets",
  "poi",
  "refineries_audits",
  "refineries_capacities",
  "refineries_methods",
  "refineries_yields",
  "space_stations",
  "star_systems",
  "terminals",
  "terminals_distances",
  "user",
  "user_refineries_jobs",
  "user_trades",
  "vehicles",
  "vehicles_loaners",
  "vehicles_prices",
  "vehicles_purchases_prices",
  "vehicles_purchases_prices_all",
  "vehicles_rentals_prices",
  "vehicles_rentals_prices_all",
  "wallet_balance",
  "data_submit",
  "marketplace_advertise",
  "user_refineries_jobs_add",
  "user_trades_add",
  "user_trades_edit",
  "wallet_add",
  "user_refineries_jobs_remove",
  "user_trades_remove",
]);

export type UEXEndpoint = z.infer<typeof UEXEndpointObject>;

export async function queryUEX({
  endpoint,
  queryParams,
  body,
  validationObject,
  method = "GET",
  logResult = false,
}: {
  endpoint: UEXEndpoint;
  queryParams?: Record<string, string | number | undefined>;
  body?: any;
  validationObject: z.ZodType<any>;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  logResult?: boolean;
}) {
  try {
    let url = `${UEX_API_URL}${endpoint}`;

    if (queryParams && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams();

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "string") {
            params.append(key, value);
          }
          if (typeof value === "number") {
            params.append(key, value.toString());
          }
        }
      });

      if (params.toString()) {
        url = `${url}?${params.toString()}`;
      }
    }

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    if (body && method !== "GET") {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }
    if (logResult) console.log("[URL]", url);
    const resp = await fetchWithBackoff(url, options);
    if (endpoint === "data_extract") {
      return resp;
    }
    const json = await resp.json();

    if (!resp.ok) {
      throw new Error(
        `Error querying UEX: ${resp.status} ${
          resp.statusText
        }\n${JSON.stringify(json, null, 2)}`
      );
    }

    if (logResult) {
      console.log(
        `[RESULT] ${endpoint} \n\n`,
        JSON.stringify(json, null, 2).slice(0, 1000)
      );
    }

    const result = validationObject.safeParse(json);
    if (!result.success) {
      console.error(
        `Validation failed for ${endpoint}:`,
        JSON.stringify(result.error.errors.slice(0, 5), null, 2)
      );
      throw new Error("Validation failed. See logs for details.");
    }

    return result.data;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        `Validation error in UEX API response (${endpoint}):`,
        formatZodErrors(error)
      );
      throw new Error("Validation failed.");
    }
    console.error(
      `Could not query UEX API: \n\n ${endpoint} \n\n ${JSON.stringify(
        queryParams,
        null,
        2
      )}`
    );
    throw error;
  }
}

function formatZodErrors(error: ZodError) {
  return error.errors
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join("\n");
}

export function getValidationObject(validationObject: z.ZodType<any>) {
  return z.object({
    status: z.string(),
    http_code: z.number(),
    data: z.union([validationObject, z.array(validationObject)]).nullable(),
  });
}

async function fetchWithBackoff(
  url: string,
  options: RequestInit,
  maxRetries = 10,
  baseDelay = 2000,
  maxDelay = 60000
): Promise<Response> {
  let retries = 0;

  while (true) {
    try {
      const response = await fetch(url, options);

      // Check if response is JSON by trying to clone and examine the first few bytes
      const clonedResponse = response.clone();
      const text = await clonedResponse.text();

      // Simple check if it looks like HTML (starts with <!DOCTYPE or <html)
      const looksLikeHtml =
        text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html");

      if (looksLikeHtml) {
        if (retries >= maxRetries) {
          console.error(
            `Received HTML response after max retries. First 100 chars: ${text.substring(
              0,
              100
            )}`
          );
          return response; // Return the error response after max retries
        }
        throw new Error(`Received HTML instead of JSON response`);
      }

      // Only retry on server errors (5xx)
      if (response.status >= 500 && response.status < 600) {
        if (retries >= maxRetries) {
          return response; // Return the error response after max retries
        }
        throw new Error(`Server error: ${response.status}`);
      }

      // Create a new response with the text content we already read
      // This is necessary because we've consumed the original response body
      const newResponse = new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      return newResponse;
    } catch (error: any) {
      if (retries >= maxRetries) {
        console.error(`Fetch failed after ${maxRetries + 1} attempts`);
        throw error;
      }

      // Calculate delay with jitter
      const delay = Math.min(
        maxDelay,
        baseDelay * Math.pow(2, retries) * (0.8 + Math.random() * 0.4)
      );

      console.warn(
        `Fetch attempt ${retries + 1}/${
          maxRetries + 1
        } failed, retrying in ${Math.round(delay)}ms: ${error.message}`
      );

      retries++;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
