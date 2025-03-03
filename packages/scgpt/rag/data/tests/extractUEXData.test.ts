import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractUEXData } from "../extract";

// Mock all the extraction functions
vi.mock("../extraction-functions", () => ({
  getCoreReferenceData: vi.fn().mockResolvedValue({
    gameVersions: { live: "4.0.2", ptu: "" },
    starSystems: [{ id: 1, name: "Stanton", id_faction: 1 }],
    factions: [{ id: 1, name: "UEE" }],
    jurisdictions: [{ id: 1, name: "UEE Law" }],
    companies: [{ id: 1, name: "Aegis Dynamics" }],
    commodityStatus: [{ code: "1", name: "Available" }],
    refineryMethods: [{ id: 1, name: "Fast" }],
  }),
  getLocationHierarchyData: vi.fn().mockResolvedValue({
    1: {
      // Stanton system
      system: { id: 1, name: "Stanton" },
      planets: [
        { id: 1, name: "Crusader", moons: [{ id: 101, name: "Daymar" }] },
      ],
      orbits: [{ id: 1, name: "OM-1" }],
      spaceStations: [{ id: 1, name: "Port Olisar" }],
    },
  }),
  getTradingTerminalData: vi.fn().mockResolvedValue({
    allTerminals: [{ id: 1, name: "Admin Office" }],
    terminalDistances: [{ distance: 10 }],
    majorTerminals: [{ id: 1, name: "Admin Office", is_default_system: 1 }],
  }),
  getCommodityTradingData: vi.fn().mockResolvedValue({
    commodities: [{ id: 1, name: "Agricium" }],
    commodityAverages: [{ id: 1, commodity_name: "Agricium" }],
    commodityRanking: [{ name: "Agricium", cax_score: 1000 }],
    allCommodityPrices: [{ id: 1, commodity_name: "Agricium" }],
    allRawCommodityPrices: [{ id: 2, commodity_name: "Gold" }],
    commodityPriceHistory: [
      { id: 1, commodity_name: "Agricium", date_added: 123456789 },
    ],
  }),
  getFuelData: vi
    .fn()
    .mockResolvedValue([{ id: 1, price_buy: 100, terminal_name: "Refinery" }]),
  getVehicleData: vi.fn().mockResolvedValue({
    vehicles: [{ id: 1, name: "Avenger Titan" }],
    allVehiclePurchasePrices: [{ id: 1, price_buy: 785000 }],
    allVehicleRentalPrices: [{ id: 1, price_rent: 10000 }],
    vehiclePledgePrices: [{ id: 1, price: 60 }],
    vehicleLoaners: [{ id: 1, name: "Avenger Titan", loaners: [] }],
  }),
  getItemsData: vi.fn().mockResolvedValue({
    categories: [{ id: 1, name: "Weapons" }],
    items: [{ id: 1, name: "FS-9 LMG" }],
    allItemPrices: [{ id: 1, price_buy: 8500 }],
    itemAttributes: [
      { id: 1, item_name: "FS-9 LMG", attribute_name: "Damage", value: "9" },
    ],
  }),
  getRefineryData: vi.fn().mockResolvedValue({
    refineryCapacities: [{ id: 1, terminal_name: "Refinery Deck" }],
    refineryYields: [{ id: 1, commodity_name: "Quantanium", value: 87 }],
    refineryAudits: [{ id: 1, commodity_name: "Quantanium", yield: 82 }],
  }),
  getDataExtracts: vi.fn().mockResolvedValue({
    topRoutes: "Agricium: Lyria to Area18",
    commodityPricesText: "Agricium: 27.50 aUEC/SCU",
    recentReports: "Datarunner reported 970 SCU of Medical Supplies at Area18",
  }),
}));

describe("extractUEXData", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it("should extract all UEX data and return a structured dataset", async () => {
    // Execute the function
    const result = await extractUEXData();

    // Verify the structure of the result
    expect(result).toHaveProperty("metadata");
    expect(result).toHaveProperty("core");
    expect(result).toHaveProperty("locations");
    expect(result).toHaveProperty("terminals");
    expect(result).toHaveProperty("commodities");
    expect(result).toHaveProperty("fuel");
    expect(result).toHaveProperty("vehicles");
    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("refineries");
    expect(result).toHaveProperty("extracts");

    // Verify that all extraction functions were called
    const extractionFunctions = require("../extraction-functions");
    expect(extractionFunctions.getCoreReferenceData).toHaveBeenCalledTimes(1);
    expect(extractionFunctions.getLocationHierarchyData).toHaveBeenCalledTimes(
      1
    );
    expect(extractionFunctions.getTradingTerminalData).toHaveBeenCalledTimes(1);
    expect(extractionFunctions.getCommodityTradingData).toHaveBeenCalledTimes(
      1
    );
    expect(extractionFunctions.getFuelData).toHaveBeenCalledTimes(1);
    expect(extractionFunctions.getVehicleData).toHaveBeenCalledTimes(1);
    expect(extractionFunctions.getItemsData).toHaveBeenCalledTimes(1);
    expect(extractionFunctions.getRefineryData).toHaveBeenCalledTimes(1);
    expect(extractionFunctions.getDataExtracts).toHaveBeenCalledTimes(1);

    // Verify some specific data points
    expect(result.metadata.gameVersion).toBe("4.0.2");
    expect(result.core.starSystems.length).toBe(1);
    expect(result.locations[1].planets[0].name).toBe("Crusader");
    expect(result.vehicles.vehicles[0].name).toBe("Avenger Titan");
  });

  it("should handle errors gracefully", async () => {
    // Make one of the extraction functions fail
    const extractionFunctions = require("../extraction-functions");
    extractionFunctions.getCommodityTradingData.mockRejectedValueOnce(
      new Error("API error")
    );

    // Execute and verify it throws with appropriate error message
    await expect(extractUEXData()).rejects.toThrow("API error");
  });
});
