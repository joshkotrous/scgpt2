import { UEXPlanet, UEXPlanetObject } from "@uex/planets/types";
import { UEXStarSystem, UEXStarSystemObject } from "@uex/starSystems/types";
import { z } from "zod";
import { UEXFaction, UEXFactionObject } from "@uex/factions/types";
import {
  UEXJurisdiction,
  UEXJurisdictionObject,
} from "@uex/jurisdictions/types";
import {
  UEXCommodity,
  UEXCommodityAverageObject,
  UEXCommodityObject,
  UEXCommodityPriceAllObject,
  UEXCommodityPriceHistoryObject,
  UEXCommodityRankingObject,
  UEXCommodityRawPriceAllObject,
  UEXCommodityStatusObject,
} from "@uex/commodities/types";
import { UEXGameVersionsObject } from "@uex/gameVersions/types";
import { UEXCompanyObject } from "@uex/companies/types";
import {
  UEXRefineryAuditObject,
  UEXRefineryCapacityObject,
  UEXRefineryMethodObject,
  UEXRefineryYieldObject,
} from "@uex/refineries/types";
import {
  UEXTerminalDistanceObject,
  UEXTerminalObject,
} from "@uex/terminals/types";
import { UEXFuelPriceAllObject } from "@uex/fuelPrices/types";
import {
  UEXVehicleLoanersObject,
  UEXVehicleObject,
  UEXVehiclePriceObject,
  UEXVehiclePurchasePriceAllObject,
  UEXVehicleRentalPriceAllObject,
} from "@uex/vehicles/types";
import { UEXCategoryObject } from "@uex/categories/types";
import {
  UEXItemAttributeObject,
  UEXItemObject,
  UEXItemPriceAllObject,
} from "@uex/items/types";

export interface EnhancedPlanet extends UEXPlanet {
  moons?: any[];
  outposts?: any[];
  pois?: any[];
}

export const EnhancedPlanetObject = UEXPlanetObject.extend({
  moons: z.array(z.any()).optional(),
  outposts: z.array(z.any()).optional(),
  pois: z.array(z.any()).optional(),
});

export const LocationSystemDataObject = z.object({
  system: UEXStarSystemObject,
  planets: z.array(EnhancedPlanetObject),
  orbits: z.array(z.any()),
  spaceStations: z.array(z.any()),
  outposts: z.array(z.any()),
  poi: z.array(z.any()),
  cities: z.array(z.any()),
  orbitDistances: z.any().optional(),
});

export type LocationSystemData = z.infer<typeof LocationSystemDataObject>;

export const UEXPlatformDataExtractionObject = z.object({
  metadata: z.object({
    extractionDate: z.string(),
    gameVersion: z.string(),
  }),
  core: z.object({
    gameVersions: UEXGameVersionsObject,
    starSystems: z.array(UEXStarSystemObject),
    factions: z.array(UEXFactionObject),
    jurisdictions: z.array(UEXJurisdictionObject),
    companies: z.array(UEXCompanyObject),
    commodityStatus: UEXCommodityStatusObject,
    refineryMethods: z.array(UEXRefineryMethodObject),
  }),
  locations: z.record(z.string(), LocationSystemDataObject),
  terminals: z.object({
    allTerminals: z.array(UEXTerminalObject),
    terminalDistances: z.array(UEXTerminalDistanceObject),
    majorTerminals: z.array(UEXTerminalObject),
  }),
  commodities: z.object({
    commodities: z.array(UEXCommodityObject),
    commodityAverages: z.array(UEXCommodityAverageObject),
    commodityRanking: z.array(UEXCommodityRankingObject),
    allCommodityPrices: z.array(UEXCommodityPriceAllObject),
    allRawCommodityPrices: z.array(UEXCommodityRawPriceAllObject),
    commodityPriceHistory: z.array(UEXCommodityPriceHistoryObject),
  }),
  fuel: z.array(UEXFuelPriceAllObject),
  vehicles: z.object({
    vehicles: z.array(UEXVehicleObject),
    allVehiclePurchasePrices: z.array(UEXVehiclePurchasePriceAllObject),
    allVehicleRentalPrices: z.array(UEXVehicleRentalPriceAllObject),
    vehiclePledgePrices: z.array(UEXVehiclePriceObject),
    vehicleLoaners: z.array(UEXVehicleLoanersObject),
  }),
  items: z.object({
    categories: z.array(UEXCategoryObject),
    items: z.array(UEXItemObject),
    allItemPrices: z.array(UEXItemPriceAllObject),
    itemAttributes: z.array(
      z.union([UEXItemAttributeObject, z.array(UEXItemAttributeObject)])
    ),
  }),
  refineries: z.object({
    refineryCapacities: z.array(UEXRefineryCapacityObject),
    refineryYields: z.array(UEXRefineryYieldObject),
    refineryAudits: z.array(UEXRefineryAuditObject),
  }),
  extracts: z.object({
    topRoutes: z.string(),
    commodityPricesText: z.string(),
    recentReports: z.string(),
  }),
});

export type UEXPlatformDataExtraction = z.infer<
  typeof UEXPlatformDataExtractionObject
>;

export interface UEXPlatformDataExtractionMaps {
  factions: Map<number, UEXFaction>;
  jurisdictions: Map<number, UEXJurisdiction>;
  starSystems: Map<number, UEXStarSystem>;
  commodities: Map<number, UEXCommodity>;
}

export interface EmbeddingChunk {
  id: string;
  text: string;
  metadata: {
    type: string;
    gameVersion: string;
    entityId: number;
    name: string;
    [key: string]: any;
  };
}
