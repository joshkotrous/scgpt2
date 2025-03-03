import {
  UEXCommodityPriceAll,
  UEXCommodityPriceHistory,
  UEXCommodityRawPriceAll,
} from "@uex/commodities/types";
import {
  EmbeddingChunk,
  UEXPlatformDataExtraction,
  UEXPlatformDataExtractionMaps,
} from "../types";
import { UEXVehicle } from "@uex/vehicles/types";

export async function processDataForEmbedding(
  extractedData: UEXPlatformDataExtraction
) {
  console.log("Starting data enrichment for embeddings...");

  // Create lookup maps for frequently referenced entities only
  // This avoids excessive memory usage while still allowing fast lookups
  console.log("Building reference maps...");
  const maps = {
    factions: new Map(extractedData.core.factions.map((f) => [f.id, f])),
    jurisdictions: new Map(
      extractedData.core.jurisdictions.map((j) => [j.id, j])
    ),
    starSystems: new Map(extractedData.core.starSystems.map((s) => [s.id, s])),
    commodities: new Map(
      extractedData.commodities.commodities.map((c) => [c.id, c])
    ),
  };

  // Generate chunks by category to avoid holding the entire enriched dataset in memory
  console.log("Generating star system chunks...");
  const systemChunks = generateStarSystemChunks(extractedData, maps);

  // console.log("Generating location chunks...");
  // const locationChunks = generateLocationChunks(extractedData, maps);

  // console.log("Generating terminal chunks...");
  // const terminalChunks = generateTerminalChunks(extractedData, maps);

  // console.log("Generating commodity chunks...");
  // const commodityChunks = generateCommodityChunks(extractedData, maps);

  // console.log("Generating vehicle chunks...");
  // const vehicleChunks = generateVehicleChunks(extractedData, maps);

  // Combine all chunks
  const allChunks = [
    ...systemChunks,
    // ...locationChunks,
    // ...terminalChunks,
    // ...commodityChunks,
    // ...vehicleChunks,
    // Add more categories as needed
  ];

  console.log(`Generated ${allChunks.length} total chunks for embedding`);

  // Save chunks to a file before embedding (in case of issues)

  return allChunks;
}

export function getExtractionMaps(
  extractedData: UEXPlatformDataExtraction
): UEXPlatformDataExtractionMaps {
  const maps = {
    factions: new Map(extractedData.core.factions.map((f) => [f.id, f])),
    jurisdictions: new Map(
      extractedData.core.jurisdictions.map((j) => [j.id, j])
    ),
    starSystems: new Map(extractedData.core.starSystems.map((s) => [s.id, s])),
    commodities: new Map(
      extractedData.commodities.commodities.map((c) => [c.id, c])
    ),
  };
  return maps;
}

// Example of one chunk generation function
export function generateStarSystemChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
) {
  const chunks = [];

  for (const system of extractedData.core.starSystems) {
    // Get related data
    const faction = maps.factions.get(system.id_faction);
    const jurisdiction = maps.jurisdictions.get(system.id_jurisdiction);
    const planets = extractedData.locations[system.id]?.planets || [];
    const terminals = extractedData.terminals.allTerminals.filter(
      (t) => t.id_star_system === system.id
    );

    // Create detailed text that includes the relationships
    const text = `Star System: ${system.name}
Location: ${system.name} system in the Star Citizen universe
Faction Control: ${faction?.name || "None"}
Legal Jurisdiction: ${jurisdiction?.name || "None"}
Status: ${
      system.is_available_live
        ? "Available in Star Citizen LIVE servers"
        : "Not yet available in game"
    }

Description:
The ${system.name} system contains ${planets.length} planets: ${planets
      .map((p) => p.name)
      .join(", ")}.
${
  terminals.length > 0
    ? `It has ${terminals.length} trading terminals, including: ${terminals
        .map((t) => t.name)
        .slice(0, 5)
        .join(", ")}${terminals.length > 5 ? "..." : ""}`
    : "It has no known trading terminals."
}
${system.wiki ? `More information available at: ${system.wiki}` : ""}`;

    chunks.push({
      id: `system-${system.id}`,
      text,
      metadata: {
        type: "star_system",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: system.id,
        name: system.name,
        factionId: system.id_faction,
        factionName: faction?.name,
        jurisdictionId: system.id_jurisdiction,
        jurisdictionName: jurisdiction?.name,
        isAvailableLive: system.is_available_live === 1,
        dateAdded: system.date_added,
        dateModified: system.date_modified,
      },
    });
  }

  return chunks;
}

export function generateLocationChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // Process each star system's location data
  Object.entries(extractedData.locations).forEach(
    ([systemIdStr, locationData]) => {
      const systemId = Number(systemIdStr);
      const system = maps.starSystems.get(systemId);

      if (!system) {
        console.warn(`Star system with ID ${systemId} not found in map`);
        return;
      }

      // --- Process Planets ---
      for (const planet of locationData.planets) {
        const faction = maps.factions.get(planet.id_faction);
        const jurisdiction = maps.jurisdictions.get(planet.id_jurisdiction);

        // Planet text description
        const planetText = `Planet: ${planet.name}
Location: ${planet.name} is located in the ${system.name} system
Faction Control: ${faction?.name || "None"}
Legal Jurisdiction: ${jurisdiction?.name || "None"}
Status: ${
          planet.is_available_live
            ? "Available in Star Citizen LIVE servers"
            : "Not yet available in game"
        }

Description:
${planet.name}${
          planet.name_origin
            ? ` (originally known as "${planet.name_origin}")`
            : ""
        } is a planet in the ${system.name} star system.
${
  planet.moons?.length
    ? `It has ${planet.moons.length} moons: ${planet.moons
        .map((m) => m.name)
        .join(", ")}.`
    : "It has no known moons."
}
${
  planet.outposts?.length
    ? `There are ${
        planet.outposts.length
      } outposts on this planet: ${planet.outposts
        .map((o) => o.name)
        .join(", ")}.`
    : "There are no known outposts on this planet."
}
${
  planet.pois?.length
    ? `Points of interest include: ${planet.pois
        .map((p) => p.name)
        .join(", ")}.`
    : ""
}`;

        chunks.push({
          id: `planet-${planet.id}`,
          text: planetText,
          metadata: {
            type: "planet",
            gameVersion: extractedData.metadata.gameVersion,
            entityId: planet.id,
            name: planet.name,
            systemId: systemId,
            systemName: system.name,
            factionId: planet.id_faction,
            factionName: faction?.name,
            jurisdictionId: planet.id_jurisdiction,
            jurisdictionName: jurisdiction?.name,
            isAvailableLive: planet.is_available_live === 1,
            dateAdded: planet.date_added,
            dateModified: planet.date_modified,
          },
        });

        // --- Process Moons ---
        if (planet.moons && planet.moons.length > 0) {
          for (const moon of planet.moons) {
            const moonFaction = maps.factions.get(moon.id_faction);
            const moonJurisdiction = maps.jurisdictions.get(
              moon.id_jurisdiction
            );

            const moonText = `Moon: ${moon.name}
Location: ${moon.name} is a moon orbiting planet ${planet.name} in the ${
              system.name
            } system
Faction Control: ${moonFaction?.name || "None"}
Legal Jurisdiction: ${moonJurisdiction?.name || "None"}
Status: ${
              moon.is_available_live
                ? "Available in Star Citizen LIVE servers"
                : "Not yet available in game"
            }

Description:
${moon.name}${
              moon.name_origin
                ? ` (originally known as "${moon.name_origin}")`
                : ""
            } is a moon orbiting the planet ${planet.name} in the ${
              system.name
            } star system.
${moon.is_landable ? "This moon is landable by spacecraft." : ""}`;

            chunks.push({
              id: `moon-${moon.id}`,
              text: moonText,
              metadata: {
                type: "moon",
                gameVersion: extractedData.metadata.gameVersion,
                entityId: moon.id,
                name: moon.name,
                planetId: planet.id,
                planetName: planet.name,
                systemId: systemId,
                systemName: system.name,
                factionId: moon.id_faction,
                factionName: moonFaction?.name,
                jurisdictionId: moon.id_jurisdiction,
                jurisdictionName: moonJurisdiction?.name,
                isAvailableLive: moon.is_available_live === 1,
                isLandable: moon.is_landable === 1,
                dateAdded: moon.date_added,
                dateModified: moon.date_modified,
              },
            });
          }
        }
      }

      // --- Process Space Stations ---
      for (const station of locationData.spaceStations) {
        const stationFaction = maps.factions.get(station.id_faction);
        const stationJurisdiction = maps.jurisdictions.get(
          station.id_jurisdiction
        );

        // Get terminals at this station
        const stationTerminals = extractedData.terminals.allTerminals.filter(
          (t) => t.id_space_station === station.id
        );

        // Find related location
        let locationName = `the ${system.name} system`;
        if (station.id_orbit) {
          const orbit = locationData.orbits.find(
            (o) => o.id === station.id_orbit
          );
          if (orbit)
            locationName = `orbit ${orbit.name} in the ${system.name} system`;
        } else if (station.id_planet) {
          const planet = locationData.planets.find(
            (p) => p.id === station.id_planet
          );
          if (planet)
            locationName = `planet ${planet.name} in the ${system.name} system`;
        } else if (station.id_moon) {
          // Find the moon by matching with moons from all planets
          let foundMoon;
          for (const planet of locationData.planets) {
            if (planet.moons) {
              foundMoon = planet.moons.find((m) => m.id === station.id_moon);
              if (foundMoon) {
                locationName = `moon ${foundMoon.name} orbiting planet ${planet.name} in the ${system.name} system`;
                break;
              }
            }
          }
        }

        const stationText = `Space Station: ${station.name}
Location: ${station.name} is located in ${locationName}
${station.nickname ? `Nickname: ${station.nickname}` : ""}
Faction Control: ${stationFaction?.name || "None"}
Legal Jurisdiction: ${stationJurisdiction?.name || "None"}
Status: ${
          station.is_available_live
            ? "Available in Star Citizen LIVE servers"
            : "Not yet available in game"
        }

Description:
${station.name} is a space station in ${locationName}.
${
  station.is_armistice
    ? "This is an armistice zone where weapons cannot be used."
    : ""
}
${station.is_landable ? "This station is landable/dockable by spacecraft." : ""}
${station.has_quantum_marker ? "It has a quantum travel marker." : ""}

Facilities and Services:
${station.has_habitation ? "- Habitation facilities" : ""}
${station.has_refinery ? "- Refinery services" : ""}
${station.has_cargo_center ? "- Cargo center" : ""}
${station.has_clinic ? "- Medical clinic" : ""}
${station.has_food ? "- Food services" : ""}
${station.has_shops ? "- Shopping facilities" : ""}
${station.has_refuel ? "- Refueling services" : ""}
${station.has_repair ? "- Ship repair services" : ""}
${
  stationTerminals.length > 0
    ? `- ${stationTerminals.length} trading terminals`
    : ""
}
${station.has_docking_port ? "- Docking port facilities" : ""}
${station.has_freight_elevator ? "- Freight elevator" : ""}

${station.pad_types ? `Pad types: ${station.pad_types}` : ""}`;

        chunks.push({
          id: `station-${station.id}`,
          text: stationText,
          metadata: {
            type: "space_station",
            gameVersion: extractedData.metadata.gameVersion,
            entityId: station.id,
            name: station.name,
            systemId: systemId,
            systemName: system.name,
            planetId: station.id_planet,
            moonId: station.id_moon,
            orbitId: station.id_orbit,
            factionId: station.id_faction,
            factionName: stationFaction?.name,
            jurisdictionId: station.id_jurisdiction,
            jurisdictionName: stationJurisdiction?.name,
            isArmistice: station.is_armistice === 1,
            isLandable: station.is_landable === 1,
            hasRefuel: station.has_refuel === 1,
            hasRepair: station.has_repair === 1,
            hasShops: station.has_shops === 1,
            hasTradeTerminals: stationTerminals.length > 0,
            isAvailableLive: station.is_available_live === 1,
            dateAdded: station.date_added,
            dateModified: station.date_modified,
          },
        });
      }

      // --- Process Orbits (Lagrange points, etc.) ---
      for (const orbit of locationData.orbits) {
        if (orbit.is_lagrange) {
          const orbitText = `Lagrange Point: ${orbit.name}
Location: ${orbit.name} is a Lagrange point in the ${system.name} system
Status: ${
            orbit.is_available_live
              ? "Available in Star Citizen LIVE servers"
              : "Not yet available in game"
          }

Description:
${orbit.name}${
            orbit.name_origin
              ? ` (originally known as "${orbit.name_origin}")`
              : ""
          } is a Lagrange point in the ${system.name} star system.
${orbit.is_man_made ? "This is a man-made orbital point." : ""}
${orbit.is_asteroid ? "This orbital point contains asteroids." : ""}`;

          chunks.push({
            id: `orbit-${orbit.id}`,
            text: orbitText,
            metadata: {
              type: "lagrange_point",
              gameVersion: extractedData.metadata.gameVersion,
              entityId: orbit.id,
              name: orbit.name,
              systemId: systemId,
              systemName: system.name,
              isAsteroid: orbit.is_asteroid === 1,
              isManMade: orbit.is_man_made === 1,
              isAvailableLive: orbit.is_available_live === 1,
              dateAdded: orbit.date_added,
              dateModified: orbit.date_modified,
            },
          });
        }
      }

      // --- Process Outposts ---
      for (const outpost of locationData.outposts) {
        const outpostFaction = maps.factions.get(outpost.id_faction);
        const outpostJurisdiction = maps.jurisdictions.get(
          outpost.id_jurisdiction
        );

        // Get terminals at this outpost
        const outpostTerminals = extractedData.terminals.allTerminals.filter(
          (t) => t.id_outpost === outpost.id
        );

        // Find location context
        let locationContext = `in the ${system.name} system`;
        if (outpost.id_planet) {
          const planet = locationData.planets.find(
            (p) => p.id === outpost.id_planet
          );
          if (planet)
            locationContext = `on planet ${planet.name} in the ${system.name} system`;
        } else if (outpost.id_moon) {
          // Find the moon by matching with moons from all planets
          for (const planet of locationData.planets) {
            if (planet.moons) {
              const foundMoon = planet.moons.find(
                (m) => m.id === outpost.id_moon
              );
              if (foundMoon) {
                locationContext = `on moon ${foundMoon.name} orbiting planet ${planet.name} in the ${system.name} system`;
                break;
              }
            }
          }
        }

        const outpostText = `Outpost: ${outpost.name}
Location: ${outpost.name} is located ${locationContext}
${outpost.nickname ? `Nickname: ${outpost.nickname}` : ""}
Faction Control: ${outpostFaction?.name || "None"}
Legal Jurisdiction: ${outpostJurisdiction?.name || "None"}
Status: ${
          outpost.is_available_live
            ? "Available in Star Citizen LIVE servers"
            : "Not yet available in game"
        }

Description:
${outpost.name} is an outpost located ${locationContext}.
${
  outpost.is_armistice
    ? "This is an armistice zone where weapons cannot be used."
    : ""
}
${outpost.is_landable ? "This outpost is landable by spacecraft." : ""}
${outpost.has_quantum_marker ? "It has a quantum travel marker." : ""}

Facilities and Services:
${outpost.has_habitation ? "- Habitation facilities" : ""}
${outpost.has_refinery ? "- Refinery services" : ""}
${outpost.has_cargo_center ? "- Cargo center" : ""}
${outpost.has_clinic ? "- Medical clinic" : ""}
${outpost.has_food ? "- Food services" : ""}
${outpost.has_shops ? "- Shopping facilities" : ""}
${outpost.has_refuel ? "- Refueling services" : ""}
${outpost.has_repair ? "- Ship repair services" : ""}
${
  outpostTerminals.length > 0
    ? `- ${outpostTerminals.length} trading terminals`
    : ""
}
${outpost.has_loading_dock ? "- Loading dock facilities" : ""}
${outpost.has_freight_elevator ? "- Freight elevator" : ""}

${outpost.pad_types ? `Pad types: ${outpost.pad_types}` : ""}`;

        chunks.push({
          id: `outpost-${outpost.id}`,
          text: outpostText,
          metadata: {
            type: "outpost",
            gameVersion: extractedData.metadata.gameVersion,
            entityId: outpost.id,
            name: outpost.name,
            systemId: systemId,
            systemName: system.name,
            planetId: outpost.id_planet,
            moonId: outpost.id_moon,
            factionId: outpost.id_faction,
            factionName: outpostFaction?.name,
            jurisdictionId: outpost.id_jurisdiction,
            jurisdictionName: outpostJurisdiction?.name,
            isArmistice: outpost.is_armistice === 1,
            isLandable: outpost.is_landable === 1,
            hasRefuel: outpost.has_refuel === 1,
            hasRepair: outpost.has_repair === 1,
            hasShops: outpost.has_shops === 1,
            hasTradeTerminals: outpostTerminals.length > 0,
            isAvailableLive: outpost.is_available_live === 1,
            dateAdded: outpost.date_added,
            dateModified: outpost.date_modified,
          },
        });
      }
    }
  );

  return chunks;
}
/**
 * Generate chunks for factions in the Star Citizen universe
 */
export function generateFactionChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // Process each faction
  for (const faction of extractedData.core.factions) {
    // Parse related IDs from comma-separated strings
    const starSystemIds = faction.ids_star_systems
      ? faction.ids_star_systems
          .split(",")
          .map((id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id))
      : [];

    const friendlyFactionIds = faction.ids_factions_friendly
      ? faction.ids_factions_friendly
          .split(",")
          .map((id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id))
      : [];

    const hostileFactionIds = faction.ids_factions_hostile
      ? faction.ids_factions_hostile
          .split(",")
          .map((id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id))
      : [];

    // Get related star systems
    const starSystems = starSystemIds
      .map((id) => maps.starSystems.get(id))
      .filter(Boolean)
      .map((system) => system!.name);

    // Get friendly and hostile factions
    const friendlyFactions = friendlyFactionIds
      .map((id) => maps.factions.get(id))
      .filter(Boolean)
      .map((faction) => faction!.name);

    const hostileFactions = hostileFactionIds
      .map((id) => maps.factions.get(id))
      .filter(Boolean)
      .map((faction) => faction!.name);

    // Create faction description
    const factionText = `Faction: ${faction.name}
${faction.wiki ? `Information: ${faction.wiki}` : ""}

Description:
${faction.name} is a faction in the Star Citizen universe.
${faction.is_piracy ? "This faction is involved in piracy activities." : ""}
${
  faction.is_bounty_hunting
    ? "This faction is involved in bounty hunting activities."
    : ""
}

Presence:
${
  starSystems.length > 0
    ? `Star systems under ${
        faction.name
      } control or influence: ${starSystems.join(", ")}`
    : `${faction.name} does not control any known star systems.`
}

Relations:
${
  friendlyFactions.length > 0
    ? `Allied factions: ${friendlyFactions.join(", ")}`
    : "No known allied factions."
}
${
  hostileFactions.length > 0
    ? `Hostile factions: ${hostileFactions.join(", ")}`
    : "No known hostile factions."
}`;

    // Create faction chunk
    chunks.push({
      id: `faction-${faction.id}`,
      text: factionText,
      metadata: {
        type: "faction",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: faction.id,
        name: faction.name,
        isPiracy: faction.is_piracy === 1,
        isBountyHunting: faction.is_bounty_hunting === 1,
        controlledSystemsCount: starSystems.length,
        friendlyFactionsCount: friendlyFactions.length,
        hostileFactionsCount: hostileFactions.length,
        dateAdded: faction.date_added,
        dateModified: faction.date_modified,
      },
    });
  }

  return chunks;
}

/**
 * Generate chunks for jurisdictions in the Star Citizen universe
 */
export function generateJurisdictionChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // Process each jurisdiction
  for (const jurisdiction of extractedData.core.jurisdictions) {
    const faction = maps.factions.get(jurisdiction.id_faction);

    // Find star systems with this jurisdiction
    const systemsWithJurisdiction = extractedData.core.starSystems.filter(
      (system) => system.id_jurisdiction === jurisdiction.id
    );

    // Find locations with this jurisdiction
    const locationsWithJurisdiction: string[] = [];

    // Iterate through all location data to find entities with this jurisdiction
    Object.values(extractedData.locations).forEach((locationData) => {
      // Check planets
      locationData.planets.forEach((planet) => {
        if (planet.id_jurisdiction === jurisdiction.id) {
          locationsWithJurisdiction.push(`Planet ${planet.name}`);
        }
      });

      // Check space stations
      locationData.spaceStations.forEach((station) => {
        if (station.id_jurisdiction === jurisdiction.id) {
          locationsWithJurisdiction.push(`Space Station ${station.name}`);
        }
      });

      // Check outposts
      locationData.outposts.forEach((outpost) => {
        if (outpost.id_jurisdiction === jurisdiction.id) {
          locationsWithJurisdiction.push(`Outpost ${outpost.name}`);
        }
      });
    });

    const jurisdictionText = `Jurisdiction: ${jurisdiction.name}
${jurisdiction.nickname ? `Nickname: ${jurisdiction.nickname}` : ""}
Controlling Faction: ${faction?.name || "Unknown"}
Status: ${
      jurisdiction.is_available_live
        ? "Available in Star Citizen LIVE servers"
        : "Not yet available in game"
    }

Description:
${
  jurisdiction.name
} is a legal jurisdiction in the Star Citizen universe, controlled by ${
      faction?.name || "an unknown faction"
    }.
This jurisdiction determines the legal framework and law enforcement protocols in its territory.
${jurisdiction.wiki ? `More information: ${jurisdiction.wiki}` : ""}

Territories:
${
  systemsWithJurisdiction.length > 0
    ? `Star systems under ${
        jurisdiction.name
      } jurisdiction: ${systemsWithJurisdiction.map((s) => s.name).join(", ")}`
    : `No known star systems under ${jurisdiction.name} jurisdiction.`
}
${
  locationsWithJurisdiction.length > 0
    ? `Other locations under ${
        jurisdiction.name
      } jurisdiction: ${locationsWithJurisdiction.join(", ")}`
    : `No other known locations under ${jurisdiction.name} jurisdiction.`
}`;

    chunks.push({
      id: `jurisdiction-${jurisdiction.id}`,
      text: jurisdictionText,
      metadata: {
        type: "jurisdiction",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: jurisdiction.id,
        name: jurisdiction.name,
        factionId: jurisdiction.id_faction,
        factionName: faction?.name,
        isDefault: jurisdiction.is_default === 1,
        isAvailableLive: jurisdiction.is_available_live === 1,
        territoriesCount:
          systemsWithJurisdiction.length + locationsWithJurisdiction.length,
        dateAdded: jurisdiction.date_added,
        dateModified: jurisdiction.date_modified,
      },
    });
  }

  return chunks;
}

/**
 * Generate chunks for trading terminals in the Star Citizen universe
 */
export function generateTerminalChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // Process each terminal
  for (const terminal of extractedData.terminals.allTerminals) {
    // Get related entities
    const faction = maps.factions.get(terminal.id_faction);

    // Find tradable commodities at this terminal
    const tradableCommodities: {
      commodity: string;
      canBuy: boolean;
      canSell: boolean;
      buyPrice?: number;
      sellPrice?: number;
    }[] = [];

    // Check commodity prices
    extractedData.commodities.allCommodityPrices.forEach((price) => {
      if (price.id_terminal === terminal.id) {
        const commodity = maps.commodities.get(price.id_commodity);
        if (commodity) {
          tradableCommodities.push({
            commodity: commodity.name,
            canBuy: price.price_buy > 0,
            canSell: price.price_sell > 0,
            buyPrice: price.price_buy > 0 ? price.price_buy : undefined,
            sellPrice: price.price_sell > 0 ? price.price_sell : undefined,
          });
        }
      }
    });

    // Sort tradable commodities by name
    tradableCommodities.sort((a, b) => a.commodity.localeCompare(b.commodity));

    // Find terminal distances to other major terminals
    const distances = extractedData.terminals.terminalDistances.filter(
      (d) => d.terminal_code_origin === terminal.code
    );

    // Sort distances by shortest first
    distances.sort((a, b) => a.distance - b.distance);

    // Build location information
    let location = `${terminal.star_system_name} system`;
    const locationDetails: string[] = [];

    if (terminal.planet_name)
      locationDetails.push(`Planet: ${terminal.planet_name}`);
    if (terminal.moon_name) locationDetails.push(`Moon: ${terminal.moon_name}`);
    if (terminal.space_station_name)
      locationDetails.push(`Space Station: ${terminal.space_station_name}`);
    if (terminal.outpost_name)
      locationDetails.push(`Outpost: ${terminal.outpost_name}`);
    if (terminal.city_name) locationDetails.push(`City: ${terminal.city_name}`);

    if (locationDetails.length > 0) {
      location += ` (${locationDetails.join(", ")})`;
    }

    // Create terminal description
    const terminalText = `Terminal: ${terminal.name} (${terminal.code})
${terminal.nickname ? `Nickname: ${terminal.nickname}` : ""}
Location: ${location}
Type: ${terminal.type}
Faction: ${faction?.name || "Unknown"}
Company: ${terminal.company_name || "Unknown"}

Description:
${terminal.name} is a ${
      terminal.type
    } trading terminal located in the ${location}.
${
  terminal.is_nqa
    ? "This is a No Questions Asked (NQA) terminal that will accept illegal goods."
    : ""
}
${terminal.is_player_owned ? "This terminal is player-owned." : ""}
${terminal.is_default_system ? "This is a major trading hub." : ""}

Facilities and Services:
${terminal.is_habitation ? "- Habitation facilities" : ""}
${terminal.is_refinery ? "- Refinery services" : ""}
${terminal.is_cargo_center ? "- Cargo center" : ""}
${terminal.is_medical ? "- Medical services" : ""}
${terminal.is_food ? "- Food services" : ""}
${terminal.is_shop_fps ? "- FPS equipment shop" : ""}
${terminal.is_shop_vehicle ? "- Vehicle components shop" : ""}
${terminal.is_refuel ? "- Refueling services" : ""}
${terminal.is_repair ? "- Repair services" : ""}
${terminal.has_loading_dock ? "- Loading dock" : ""}
${terminal.has_docking_port ? "- Docking port" : ""}
${terminal.has_freight_elevator ? "- Freight elevator" : ""}

Trade Information:
Maximum container size: ${terminal.max_container_size} SCU
${
  tradableCommodities.length > 0
    ? `Tradable commodities (${
        tradableCommodities.length
      }): ${tradableCommodities
        .slice(0, 10)
        .map((tc) => tc.commodity)
        .join(", ")}${tradableCommodities.length > 10 ? "..." : ""}`
    : "No known tradable commodities at this terminal."
}

${
  distances.length > 0
    ? `Distances to major trading hubs:
${distances
  .slice(0, 5)
  .map(
    (d) =>
      `- ${d.terminal_name_destination} (${
        d.terminal_code_destination
      }): ${d.distance.toFixed(2)} gigameters`
  )
  .join("\n")}`
    : "No known distance information available."
}`;

    // Create terminal chunk
    chunks.push({
      id: `terminal-${terminal.id}`,
      text: terminalText,
      metadata: {
        type: "terminal",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: terminal.id,
        name: terminal.name,
        code: terminal.code,
        terminalType: terminal.type,
        systemId: terminal.id_star_system,
        systemName: terminal.star_system_name,
        planetId: terminal.id_planet,
        planetName: terminal.planet_name,
        moonId: terminal.id_moon,
        moonName: terminal.moon_name,
        spaceStationId: terminal.id_space_station,
        spaceStationName: terminal.space_station_name,
        outpostId: terminal.id_outpost,
        outpostName: terminal.outpost_name,
        cityId: terminal.id_city,
        cityName: terminal.city_name,
        factionId: terminal.id_faction,
        factionName: faction?.name,
        companyId: terminal.id_company,
        companyName: terminal.company_name,
        isNQA: terminal.is_nqa === 1,
        isPlayerOwned: terminal.is_player_owned === 1,
        isMajorHub: terminal.is_default_system === 1,
        maxContainerSize: terminal.max_container_size,
        tradableCommoditiesCount: tradableCommodities.length,
        isAvailableLive: terminal.is_available_live === 1,
        dateAdded: terminal.date_added,
        dateModified: terminal.date_modified,
      },
    });

    // Create a separate chunk for commodities traded at this terminal if there are many
    if (tradableCommodities.length > 0) {
      const buyable = tradableCommodities.filter((tc) => tc.canBuy);
      const sellable = tradableCommodities.filter((tc) => tc.canSell);

      const commoditiesText = `Trading Commodities at ${terminal.name} (${
        terminal.code
      })
Location: ${location}
Type: ${terminal.type}

${
  buyable.length > 0
    ? `Commodities you can buy at this terminal (${buyable.length}):
${buyable
  .map(
    (tc) =>
      `- ${tc.commodity}${
        tc.buyPrice
          ? ` at approximately ${tc.buyPrice.toFixed(2)} aUEC per SCU`
          : ""
      }`
  )
  .join("\n")}`
    : "No commodities available for purchase at this terminal."
}

${
  sellable.length > 0
    ? `Commodities you can sell to this terminal (${sellable.length}):
${sellable
  .map(
    (tc) =>
      `- ${tc.commodity}${
        tc.sellPrice
          ? ` at approximately ${tc.sellPrice.toFixed(2)} aUEC per SCU`
          : ""
      }`
  )
  .join("\n")}`
    : "No commodities can be sold to this terminal."
}

Maximum container size: ${terminal.max_container_size} SCU
${
  terminal.is_nqa
    ? "This is a No Questions Asked (NQA) terminal that will accept illegal goods."
    : ""
}`;

      chunks.push({
        id: `terminal-commodities-${terminal.id}`,
        text: commoditiesText,
        metadata: {
          type: "terminal_commodities",
          gameVersion: extractedData.metadata.gameVersion,
          entityId: terminal.id,
          name: `${terminal.name} Trading Commodities`,
          code: terminal.code,
          terminalType: terminal.type,
          systemName: terminal.star_system_name,
          buyableCommoditiesCount: buyable.length,
          sellableCommoditiesCount: sellable.length,
          isNQA: terminal.is_nqa === 1,
          isPlayerOwned: terminal.is_player_owned === 1,
          isMajorHub: terminal.is_default_system === 1,
        },
      });
    }
  }

  if (extractedData.extracts.topRoutes) {
    chunks.push({
      id: `top-trading-routes`,
      text: `Top Trading Routes in Star Citizen:
  
  ${extractedData.extracts.topRoutes}
  
  These routes represent the most profitable trading opportunities according to UEX Corporation data.`,
      metadata: {
        type: "trading_routes",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: 0, // Add a placeholder entityId since it's required
        name: "Top Trading Routes",
      },
    });
  }

  return chunks;
}

/**
 * Generate chunks for commodities in the Star Citizen universe
 */
export function generateCommoditiesChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // Process each commodity
  for (const commodity of extractedData.commodities.commodities) {
    // Get commodity average data
    const averageData = extractedData.commodities.commodityAverages.find(
      (avg) => avg.id_commodity === commodity.id
    );

    // Get commodity ranking data
    const rankingData = extractedData.commodities.commodityRanking.find(
      (rank) => rank.name === commodity.name
    );

    // Create commodity description
    const commodityText = `Commodity: ${commodity.name} (${commodity.code})
Type: ${commodity.kind}
Weight: ${commodity.weight_scu} per SCU

Description:
${
  commodity.name
} is a ${commodity.kind.toLowerCase()} commodity in Star Citizen.
${commodity.is_raw ? "This is a raw (unrefined) commodity." : ""}
${commodity.is_refined ? "This is a refined commodity." : ""}
${commodity.is_mineral ? "This is a mineral commodity." : ""}
${commodity.is_harvestable ? "This commodity can be harvested." : ""}
${commodity.is_illegal ? "This is an illegal commodity." : ""}
${commodity.is_fuel ? "This is a fuel commodity." : ""}
${commodity.wiki ? `More information: ${commodity.wiki}` : ""}

Trade Information:
${
  commodity.is_buyable
    ? "This commodity can be purchased from terminals."
    : "This commodity cannot be purchased from terminals."
}
${
  commodity.is_sellable
    ? "This commodity can be sold to terminals."
    : "This commodity cannot be sold to terminals."
}
${
  rankingData?.availability_buy
    ? `Available for purchase at ${rankingData.availability_buy} locations.`
    : ""
}
${
  rankingData?.availability_sell
    ? `Can be sold at ${rankingData.availability_sell} locations.`
    : ""
}
${
  rankingData?.price_buy_minimum
    ? `Lowest purchase price: ${rankingData.price_buy_minimum.toFixed(
        2
      )} aUEC per SCU`
    : ""
}
${
  rankingData?.price_sell_maximum
    ? `Highest sell price: ${rankingData.price_sell_maximum.toFixed(
        2
      )} aUEC per SCU`
    : ""
}
${
  averageData?.price_buy_avg
    ? `Average purchase price: ${averageData.price_buy_avg.toFixed(
        2
      )} aUEC per SCU`
    : ""
}
${
  averageData?.price_sell_avg
    ? `Average sell price: ${averageData.price_sell_avg.toFixed(
        2
      )} aUEC per SCU`
    : ""
}

${
  rankingData && rankingData.profitability > 0
    ? `Profitability: ${rankingData.profitability.toFixed(
        2
      )} aUEC per unit with ${rankingData.profitability_relative_percentage.toFixed(
        2
      )}% profit margin`
    : ""
}
${
  rankingData?.cax_score
    ? `CAX Score: ${rankingData.cax_score} (higher is better)`
    : ""
}`;

    chunks.push({
      id: `commodity-${commodity.id}`,
      text: commodityText,
      metadata: {
        type: "commodity",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: commodity.id,
        name: commodity.name,
        code: commodity.code,
        kind: commodity.kind,
        isRaw: commodity.is_raw === 1,
        isRefined: commodity.is_refined === 1,
        isMineral: commodity.is_mineral === 1,
        isHarvestable: commodity.is_harvestable === 1,
        isIllegal: commodity.is_illegal === 1,
        isFuel: commodity.is_fuel === 1,
        isBuyable: commodity.is_buyable === 1,
        isSellable: commodity.is_sellable === 1,
        caxScore: rankingData?.cax_score,
        profitability: rankingData?.profitability,
        dateAdded: commodity.date_added,
        dateModified: commodity.date_modified,
      },
    });
  }

  return chunks;
}

/**
 * Generate chunks for commodity trading opportunities and profitable routes
 */
export function generateCommodityTradingChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // 1. Create a chunk for each commodity's best trade routes
  for (const ranking of extractedData.commodities.commodityRanking) {
    // Skip if no clear buy/sell data
    if (!ranking.price_buy_minimum || !ranking.price_sell_maximum) continue;
    if (
      !ranking.terminal_id_price_buy_minimum ||
      !ranking.terminal_id_price_sell_maximum
    )
      continue;

    const profit = ranking.price_sell_maximum - ranking.price_buy_minimum;

    // Only include profitable commodities
    if (profit <= 0) continue;

    // Find the terminal names
    const buyTerminalName =
      extractedData.terminals.allTerminals.find(
        (t) => t.id === ranking.terminal_id_price_buy_minimum
      )?.name || "Unknown Terminal";

    const sellTerminalName =
      extractedData.terminals.allTerminals.find(
        (t) => t.id === ranking.terminal_id_price_sell_maximum
      )?.name || "Unknown Terminal";

    // Get the buy terminal location
    const buyTerminal = extractedData.terminals.allTerminals.find(
      (t) => t.id === ranking.terminal_id_price_buy_minimum
    );

    let buyLocation = "";
    if (buyTerminal) {
      const locationParts = [];
      if (buyTerminal.outpost_name)
        locationParts.push(buyTerminal.outpost_name);
      if (buyTerminal.city_name) locationParts.push(buyTerminal.city_name);
      if (buyTerminal.moon_name) locationParts.push(buyTerminal.moon_name);
      if (buyTerminal.planet_name) locationParts.push(buyTerminal.planet_name);
      if (buyTerminal.star_system_name)
        locationParts.push(buyTerminal.star_system_name);

      buyLocation = locationParts.join(", ");
    }

    // Get the sell terminal location
    const sellTerminal = extractedData.terminals.allTerminals.find(
      (t) => t.id === ranking.terminal_id_price_sell_maximum
    );

    let sellLocation = "";
    if (sellTerminal) {
      const locationParts = [];
      if (sellTerminal.outpost_name)
        locationParts.push(sellTerminal.outpost_name);
      if (sellTerminal.city_name) locationParts.push(sellTerminal.city_name);
      if (sellTerminal.moon_name) locationParts.push(sellTerminal.moon_name);
      if (sellTerminal.planet_name)
        locationParts.push(sellTerminal.planet_name);
      if (sellTerminal.star_system_name)
        locationParts.push(sellTerminal.star_system_name);

      sellLocation = locationParts.join(", ");
    }

    // Find the distance between terminals if available
    let distance: number | undefined;
    if (buyTerminal && sellTerminal) {
      const distanceData = extractedData.terminals.terminalDistances.find(
        (d) =>
          d.terminal_code_origin === buyTerminal.code &&
          d.terminal_code_destination === sellTerminal.code
      );

      if (distanceData) {
        distance = distanceData.distance;
      }
    }

    const tradingText = `Commodity Trading Route: ${ranking.name}

Buy Location: ${buyTerminalName} (${buyLocation})
Buy Price: ${ranking.price_buy_minimum.toFixed(2)} aUEC per SCU

Sell Location: ${sellTerminalName} (${sellLocation})
Sell Price: ${ranking.price_sell_maximum.toFixed(2)} aUEC per SCU

Profit per SCU: ${profit.toFixed(2)} aUEC (${(
      (profit / ranking.price_buy_minimum) *
      100
    ).toFixed(2)}% return)
${distance ? `Distance: ${distance.toFixed(2)} gigameters` : ""}
${
  ranking.investment_per_scu
    ? `Investment required per SCU: ${ranking.investment_per_scu.toFixed(
        2
      )} aUEC`
    : ""
}
${
  ranking.profitability_per_scu
    ? `Profitability per SCU: ${ranking.profitability_per_scu.toFixed(2)} aUEC`
    : ""
}
${
  ranking.availability_buy > 0 && ranking.availability_sell > 0
    ? `Availability: Can be bought at ${ranking.availability_buy} locations and sold at ${ranking.availability_sell} locations.`
    : ""
}

This route represents one of the most profitable trade opportunities for ${
      ranking.name
    } based on current UEX data.`;

    chunks.push({
      id: `commodity-route-${ranking.id}`,
      text: tradingText,
      metadata: {
        type: "commodity_route",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: ranking.id,
        name: `${ranking.name} Trading Route`,
        commodityName: ranking.name,
        commodityId: ranking.id,
        buyTerminalId: ranking.terminal_id_price_buy_minimum,
        sellTerminalId: ranking.terminal_id_price_sell_maximum,
        profit: profit,
        profitPercentage: (profit / ranking.price_buy_minimum) * 100,
        distance: distance,
        caxScore: ranking.cax_score,
      },
    });
  }

  // 2. Create a single chunk with top trading routes
  if (
    extractedData.extracts.topRoutes &&
    extractedData.extracts.topRoutes.length > 0
  ) {
    chunks.push({
      id: `top-trading-routes`,
      text: `Top Trading Routes in Star Citizen:

${extractedData.extracts.topRoutes}

These routes represent the most profitable trading opportunities according to UEX Corporation data.`,
      metadata: {
        type: "top_trading_routes",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: 0,
        name: "Top Trading Routes",
      },
    });
  }

  // 3. Create a summary of commodity statistics
  const commodityStats = `Commodity Market Overview:

Most Profitable Commodities:
${extractedData.commodities.commodityRanking
  .sort(
    (a, b) => (b.profitability_per_scu || 0) - (a.profitability_per_scu || 0)
  )
  .slice(0, 10)
  .map(
    (c, i) =>
      `${i + 1}. ${c.name}: ${
        c.profitability_per_scu?.toFixed(2) || 0
      } aUEC per SCU`
  )
  .join("\n")}

Highest CAX Score Commodities:
${extractedData.commodities.commodityRanking
  .sort((a, b) => (b.cax_score || 0) - (a.cax_score || 0))
  .slice(0, 10)
  .map((c, i) => `${i + 1}. ${c.name}: ${c.cax_score} CAX`)
  .join("\n")}

Most Widely Available Commodities:
${extractedData.commodities.commodityRanking
  .sort(
    (a, b) =>
      b.availability_buy +
      b.availability_sell -
      (a.availability_buy + a.availability_sell)
  )
  .slice(0, 10)
  .map(
    (c, i) =>
      `${i + 1}. ${c.name}: Available at ${
        c.availability_buy + c.availability_sell
      } locations`
  )
  .join("\n")}`;

  chunks.push({
    id: `commodity-market-overview`,
    text: commodityStats,
    metadata: {
      type: "commodity_market_overview",
      gameVersion: extractedData.metadata.gameVersion,
      entityId: 0,
      name: "Commodity Market Overview",
    },
  });

  return chunks;
}

/**
 * Generate chunks for commodity price history and trends
 */
export function generateCommodityPriceHistoryChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // Group price history by commodity and terminal
  const historyByPair = new Map<string, UEXCommodityPriceHistory[]>();

  for (const history of extractedData.commodities.commodityPriceHistory) {
    const key = `${history.id_commodity}-${history.id_terminal}`;
    if (!historyByPair.has(key)) {
      historyByPair.set(key, []);
    }
    historyByPair.get(key)?.push(history);
  }

  // Create chunks for significant price histories
  for (const [key, histories] of historyByPair.entries()) {
    // Only include if we have enough history points
    if (histories.length < 3) continue;

    // Sort by date
    histories.sort((a, b) => a.date_added - b.date_added);

    const firstHistory = histories[0];
    const lastHistory = histories[histories.length - 1];

    // Calculate price changes
    const buyPriceChange = lastHistory.price_buy - firstHistory.price_buy;
    const buyPriceChangePercent =
      (buyPriceChange / firstHistory.price_buy) * 100;

    const sellPriceChange = lastHistory.price_sell - firstHistory.price_sell;
    const sellPriceChangePercent =
      (sellPriceChange / firstHistory.price_sell) * 100;

    // Create a summary of the price trends
    const historyText = `Price History for ${firstHistory.commodity_name} at ${
      firstHistory.terminal_name
    }:

Location: ${firstHistory.terminal_name}, ${firstHistory.star_system_name}

Current Prices (as of ${new Date(
      lastHistory.date_added * 1000
    ).toLocaleDateString()}):
Buy Price: ${lastHistory.price_buy.toFixed(2)} aUEC per SCU
Sell Price: ${lastHistory.price_sell.toFixed(2)} aUEC per SCU

Price Changes (over ${histories.length} data points):
Buy Price: ${buyPriceChange > 0 ? "+" : ""}${buyPriceChange.toFixed(
      2
    )} aUEC (${buyPriceChangePercent.toFixed(2)}%)
Sell Price: ${sellPriceChange > 0 ? "+" : ""}${sellPriceChange.toFixed(
      2
    )} aUEC (${sellPriceChangePercent.toFixed(2)}%)

Supply Information:
Current Buy Supply: ${lastHistory.scu_buy} SCU
Current Sell Stock: ${lastHistory.scu_sell_stock} SCU
Current Sell Demand: ${lastHistory.scu_sell} SCU

This data represents the price history for ${firstHistory.commodity_name} at ${
      firstHistory.terminal_name
    } over time.`;

    chunks.push({
      id: `commodity-history-${firstHistory.id_commodity}-${firstHistory.id_terminal}`,
      text: historyText,
      metadata: {
        type: "commodity_price_history",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: firstHistory.id,
        name: `${firstHistory.commodity_name} Price History at ${firstHistory.terminal_name}`,
        commodityId: firstHistory.id_commodity,
        commodityName: firstHistory.commodity_name,
        terminalId: firstHistory.id_terminal,
        terminalName: firstHistory.terminal_name,
        buyPriceChange: buyPriceChangePercent,
        sellPriceChange: sellPriceChangePercent,
        dataPoints: histories.length,
      },
    });
  }

  return chunks;
}

/**
 * Generate chunks for commodity prices across all terminals
 */
export function generateAllCommodityPriceChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // Group all commodity prices by terminal
  const pricesByTerminal = new Map<number, UEXCommodityPriceAll[]>();

  for (const price of extractedData.commodities.allCommodityPrices) {
    if (!pricesByTerminal.has(price.id_terminal)) {
      pricesByTerminal.set(price.id_terminal, []);
    }
    pricesByTerminal.get(price.id_terminal)?.push(price);
  }

  // Create a chunk for each terminal's commodity prices
  for (const [terminalId, prices] of pricesByTerminal.entries()) {
    if (prices.length === 0) continue;

    // Get terminal information
    const terminal = extractedData.terminals.allTerminals.find(
      (t) => t.id === terminalId
    );
    if (!terminal) continue;

    // Sort prices by commodity name
    prices.sort((a, b) => a.commodity_name.localeCompare(b.commodity_name));

    // Build location string
    let location = terminal.star_system_name;
    if (terminal.planet_name) location += `, ${terminal.planet_name}`;
    if (terminal.moon_name) location += `, ${terminal.moon_name}`;
    if (terminal.space_station_name)
      location += `, ${terminal.space_station_name}`;
    if (terminal.outpost_name) location += `, ${terminal.outpost_name}`;
    if (terminal.city_name) location += `, ${terminal.city_name}`;

    // Create buyable and sellable commodity lists
    const buyableCommodities = prices
      .filter((p) => p.price_buy > 0)
      .sort((a, b) => b.price_buy - a.price_buy);

    const sellableCommodities = prices
      .filter((p) => p.price_sell > 0)
      .sort((a, b) => b.price_sell - a.price_sell);

    const terminalPricesText = `Commodity Prices at ${terminal.name} (${
      terminal.code
    })
Location: ${location}
Terminal Type: ${terminal.type}
${
  terminal.is_nqa === 1
    ? "This is a No Questions Asked (NQA) terminal that accepts illegal goods."
    : ""
}

Commodities Available for Purchase (${buyableCommodities.length}):
${
  buyableCommodities.length > 0
    ? buyableCommodities
        .map(
          (p) =>
            `- ${p.commodity_name}: ${p.price_buy.toFixed(
              2
            )} aUEC per SCU (Supply: ${p.scu_buy} SCU)`
        )
        .join("\n")
    : "No commodities available for purchase at this terminal."
}

Commodities That Can Be Sold (${sellableCommodities.length}):
${
  sellableCommodities.length > 0
    ? sellableCommodities
        .map(
          (p) =>
            `- ${p.commodity_name}: ${p.price_sell.toFixed(
              2
            )} aUEC per SCU (Demand: ${p.scu_sell} SCU)`
        )
        .join("\n")
    : "No commodities can be sold at this terminal."
}

Maximum container size: ${terminal.max_container_size} SCU
Last updated: ${new Date(
      Math.max(...prices.map((p) => p.date_modified)) * 1000
    ).toLocaleDateString()}`;

    chunks.push({
      id: `terminal-prices-${terminal.id}`,
      text: terminalPricesText,
      metadata: {
        type: "terminal_prices",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: terminal.id,
        name: `${terminal.name} Commodity Prices`,
        terminalId: terminal.id,
        terminalCode: terminal.code,
        terminalType: terminal.type,
        systemId: terminal.id_star_system,
        systemName: terminal.star_system_name,
        buyableCommoditiesCount: buyableCommodities.length,
        sellableCommoditiesCount: sellableCommodities.length,
        isNQA: terminal.is_nqa === 1,
        isPlayerOwned: terminal.is_player_owned === 1,
        lastUpdated: Math.max(...prices.map((p) => p.date_modified)),
      },
    });
  }

  // Group all commodity prices by commodity
  const pricesByCommodity = new Map<number, UEXCommodityPriceAll[]>();

  for (const price of extractedData.commodities.allCommodityPrices) {
    if (!pricesByCommodity.has(price.id_commodity)) {
      pricesByCommodity.set(price.id_commodity, []);
    }
    pricesByCommodity.get(price.id_commodity)?.push(price);
  }

  // Create a chunk for each commodity's prices across terminals
  for (const [commodityId, prices] of pricesByCommodity.entries()) {
    if (prices.length === 0) continue;

    // Get commodity information
    const commodity = maps.commodities.get(commodityId);
    if (!commodity) continue;

    // Sort prices by buy and sell prices
    const buyPrices = prices
      .filter((p) => p.price_buy > 0)
      .sort((a, b) => a.price_buy - b.price_buy);

    const sellPrices = prices
      .filter((p) => p.price_sell > 0)
      .sort((a, b) => b.price_sell - a.price_sell);

    const commodityPricesText = `Price List for ${commodity.name} (${
      commodity.code
    })
Commodity Type: ${commodity.kind}
${commodity.is_illegal === 1 ? "This is an illegal commodity." : ""}

Best Places to Buy ${commodity.name} (Lowest Prices):
${
  buyPrices.length > 0
    ? buyPrices
        .slice(0, 10)
        .map(
          (p, i) =>
            `${i + 1}. ${p.terminal_name}: ${p.price_buy.toFixed(
              2
            )} aUEC per SCU (Supply: ${p.scu_buy} SCU)`
        )
        .join("\n")
    : `${commodity.name} cannot be purchased at any known terminal.`
}

Best Places to Sell ${commodity.name} (Highest Prices):
${
  sellPrices.length > 0
    ? sellPrices
        .slice(0, 10)
        .map(
          (p, i) =>
            `${i + 1}. ${p.terminal_name}: ${p.price_sell.toFixed(
              2
            )} aUEC per SCU (Demand: ${p.scu_sell} SCU)`
        )
        .join("\n")
    : `${commodity.name} cannot be sold at any known terminal.`
}

Trading Statistics:
Available at ${buyPrices.length} locations for purchase
Can be sold at ${sellPrices.length} locations
${
  buyPrices.length > 0 && sellPrices.length > 0
    ? `Maximum potential profit: ${(
        Math.max(...sellPrices.map((p) => p.price_sell)) -
        Math.min(...buyPrices.map((p) => p.price_buy))
      ).toFixed(2)} aUEC per SCU`
    : ""
}

Last updated: ${new Date(
      Math.max(...prices.map((p) => p.date_modified)) * 1000
    ).toLocaleDateString()}`;

    chunks.push({
      id: `commodity-prices-${commodity.id}`,
      text: commodityPricesText,
      metadata: {
        type: "commodity_prices",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: commodity.id,
        name: `${commodity.name} Price List`,
        commodityId: commodity.id,
        commodityCode: commodity.code,
        commodityKind: commodity.kind,
        buyLocationsCount: buyPrices.length,
        sellLocationsCount: sellPrices.length,
        isIllegal: commodity.is_illegal === 1,
        isRaw: commodity.is_raw === 1,
        bestBuyPrice:
          buyPrices.length > 0
            ? Math.min(...buyPrices.map((p) => p.price_buy))
            : null,
        bestSellPrice:
          sellPrices.length > 0
            ? Math.max(...sellPrices.map((p) => p.price_sell))
            : null,
        lastUpdated: Math.max(...prices.map((p) => p.date_modified)),
      },
    });
  }

  // Create a separate function for raw commodity prices if needed
  // This would be similar to the above but using allRawCommodityPrices

  return chunks;
}

/**
 * Generate chunks for raw commodity prices across all terminals
 */
export function generateRawCommodityPriceChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // Group all raw commodity prices by terminal
  const pricesByTerminal = new Map<number, UEXCommodityRawPriceAll[]>();

  for (const price of extractedData.commodities.allRawCommodityPrices) {
    if (!pricesByTerminal.has(price.id_terminal)) {
      pricesByTerminal.set(price.id_terminal, []);
    }
    pricesByTerminal.get(price.id_terminal)?.push(price);
  }

  // Create a chunk for each terminal's raw commodity prices
  for (const [terminalId, prices] of pricesByTerminal.entries()) {
    if (prices.length === 0) continue;

    // Get terminal information
    const terminal = extractedData.terminals.allTerminals.find(
      (t) => t.id === terminalId
    );
    if (!terminal) continue;

    // Sort prices by commodity name
    prices.sort((a, b) => a.commodity_name.localeCompare(b.commodity_name));

    // Build location string
    let location = terminal.star_system_name;
    if (terminal.planet_name) location += `, ${terminal.planet_name}`;
    if (terminal.moon_name) location += `, ${terminal.moon_name}`;
    if (terminal.space_station_name)
      location += `, ${terminal.space_station_name}`;
    if (terminal.outpost_name) location += `, ${terminal.outpost_name}`;
    if (terminal.city_name) location += `, ${terminal.city_name}`;

    // Filter to selling only since raw commodities are only sold to terminals, not purchased
    const sellableCommodities = prices
      .filter((p) => p.price_sell > 0)
      .sort((a, b) => b.price_sell - a.price_sell);

    const terminalRawPricesText = `Raw Commodity Prices at ${terminal.name} (${
      terminal.code
    })
Location: ${location}
Terminal Type: ${terminal.type}
${
  terminal.is_nqa === 1
    ? "This is a No Questions Asked (NQA) terminal that accepts illegal goods."
    : ""
}

Raw Commodities That Can Be Sold (${sellableCommodities.length}):
${
  sellableCommodities.length > 0
    ? sellableCommodities
        .map(
          (p) =>
            `- ${p.commodity_name}: ${p.price_sell.toFixed(
              2
            )} aUEC per SCU (Average: ${p.price_sell_avg.toFixed(2)} aUEC)`
        )
        .join("\n")
    : "No raw commodities can be sold at this terminal."
}

This terminal specializes in purchasing raw (unrefined) commodities that can be obtained through mining or harvesting.
Maximum container size: ${terminal.max_container_size} SCU
Last updated: ${new Date(
      Math.max(...prices.map((p) => p.date_modified)) * 1000
    ).toLocaleDateString()}`;

    chunks.push({
      id: `terminal-raw-prices-${terminal.id}`,
      text: terminalRawPricesText,
      metadata: {
        type: "terminal_raw_prices",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: terminal.id,
        name: `${terminal.name} Raw Commodity Prices`,
        terminalId: terminal.id,
        terminalCode: terminal.code,
        terminalType: terminal.type,
        systemId: terminal.id_star_system,
        systemName: terminal.star_system_name,
        rawCommoditiesCount: sellableCommodities.length,
        isNQA: terminal.is_nqa === 1,
        isPlayerOwned: terminal.is_player_owned === 1,
        acceptsRaw: sellableCommodities.length > 0,
        lastUpdated: Math.max(...prices.map((p) => p.date_modified)),
      },
    });
  }

  // Group all raw commodity prices by commodity
  const pricesByCommodity = new Map<number, UEXCommodityRawPriceAll[]>();

  for (const price of extractedData.commodities.allRawCommodityPrices) {
    if (!pricesByCommodity.has(price.id_commodity)) {
      pricesByCommodity.set(price.id_commodity, []);
    }
    pricesByCommodity.get(price.id_commodity)?.push(price);
  }

  // Create a chunk for each raw commodity's prices across terminals
  for (const [commodityId, prices] of pricesByCommodity.entries()) {
    if (prices.length === 0) continue;

    // Get commodity information
    const commodity = maps.commodities.get(commodityId);
    if (!commodity) continue;

    // Sort prices by sell price (highest first)
    const sellPrices = prices
      .filter((p) => p.price_sell > 0)
      .sort((a, b) => b.price_sell - a.price_sell);

    const rawCommodityPricesText = `Sell Prices for Raw ${commodity.name} (${
      commodity.code
    })
Commodity Type: Raw/Unrefined ${commodity.kind}
${commodity.is_mineral === 1 ? "This is a mineral resource." : ""}
${commodity.is_harvestable === 1 ? "This resource can be harvested." : ""}
${commodity.is_illegal === 1 ? "This is an illegal commodity." : ""}

Best Places to Sell Raw ${commodity.name} (Highest Prices):
${
  sellPrices.length > 0
    ? sellPrices
        .slice(0, 10)
        .map(
          (p, i) =>
            `${i + 1}. ${p.terminal_name}: ${p.price_sell.toFixed(
              2
            )} aUEC per SCU`
        )
        .join("\n")
    : `Raw ${commodity.name} cannot be sold at any known terminal.`
}

Trading Statistics:
Can be sold at ${sellPrices.length} locations
Average sell price: ${
      sellPrices.length > 0
        ? (
            sellPrices.reduce((sum, p) => sum + p.price_sell, 0) /
            sellPrices.length
          ).toFixed(2)
        : "N/A"
    } aUEC per SCU
Highest price: ${
      sellPrices.length > 0
        ? Math.max(...sellPrices.map((p) => p.price_sell)).toFixed(2)
        : "N/A"
    } aUEC per SCU
Lowest price: ${
      sellPrices.length > 0
        ? Math.min(...sellPrices.map((p) => p.price_sell)).toFixed(2)
        : "N/A"
    } aUEC per SCU

Mining/Harvesting Information:
${
  commodity.is_mineral === 1
    ? "This resource can be mined using a mining vehicle or tool."
    : ""
}
${
  commodity.is_harvestable === 1
    ? "This resource can be harvested from the environment."
    : ""
}
${commodity.wiki ? `More information: ${commodity.wiki}` : ""}

Last updated: ${new Date(
      Math.max(...prices.map((p) => p.date_modified)) * 1000
    ).toLocaleDateString()}`;

    chunks.push({
      id: `raw-commodity-prices-${commodity.id}`,
      text: rawCommodityPricesText,
      metadata: {
        type: "raw_commodity_prices",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: commodity.id,
        name: `Raw ${commodity.name} Price List`,
        commodityId: commodity.id,
        commodityCode: commodity.code,
        commodityKind: commodity.kind,
        sellLocationsCount: sellPrices.length,
        isIllegal: commodity.is_illegal === 1,
        isMineral: commodity.is_mineral === 1,
        isHarvestable: commodity.is_harvestable === 1,
        bestSellPrice:
          sellPrices.length > 0
            ? Math.max(...sellPrices.map((p) => p.price_sell))
            : null,
        lastUpdated: Math.max(...prices.map((p) => p.date_modified)),
      },
    });
  }

  // Create a mining guide chunk with all mineral commodities
  const mineralCommodities = extractedData.commodities.commodities.filter(
    (c) => c.is_mineral === 1
  );

  if (mineralCommodities.length > 0) {
    const mineralsByValue = mineralCommodities
      .map((mineral) => {
        // Find the highest sell price for this mineral
        const prices = extractedData.commodities.allRawCommodityPrices.filter(
          (p) => p.id_commodity === mineral.id && p.price_sell > 0
        );

        const maxPrice =
          prices.length > 0 ? Math.max(...prices.map((p) => p.price_sell)) : 0;

        return {
          mineral,
          maxPrice,
          locations: prices.length,
        };
      })
      .sort((a, b) => b.maxPrice - a.maxPrice);

    const miningGuideText = `Mining Guide: Raw Minerals in Star Citizen

Most Valuable Minerals (By Highest Sell Price):
${mineralsByValue
  .map(
    (m, i) =>
      `${i + 1}. ${m.mineral.name}: Best price ${m.maxPrice.toFixed(
        2
      )} aUEC per SCU, available at ${m.locations} locations`
  )
  .join("\n")}

General Mining Information:
- Raw minerals can be mined using mining vehicles like the Prospector or MOLE, or with hand mining tools.
- After mining, raw minerals can be sold directly at raw ore terminals or refined at refineries for better prices.
- Mining requires scanning for deposits, breaking rocks, and extracting valuable minerals.
- Some minerals are more volatile than others and require careful extraction.
- The Stanton system, particularly the moons of Crusader, Aberdeen, and Daymar, are popular mining locations.
- Lyria (moon of ArcCorp) is known for its rich Quantanium deposits.
- The Aaron Halo (asteroid belt) also contains valuable mineral deposits.

Mining Equipment:
- Hand mining: ROC vehicle for surface deposits, or personal mining tools for FPS mining
- Ship mining: MISC Prospector (solo), ARGO MOLE (multi-crew)
- Mining consumables can help with difficult extractions

This guide provides an overview of the most valuable minerals that can be mined in Star Citizen.`;

    chunks.push({
      id: `mining-guide`,
      text: miningGuideText,
      metadata: {
        type: "mining_guide",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: 0,
        name: "Mining Guide: Raw Minerals",
        mineralCount: mineralCommodities.length,
      },
    });
  }

  return chunks;
}

/**
 * Generate chunks for companies in the Star Citizen universe
 */
export function generateCompaniesChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // Process each company
  for (const company of extractedData.core.companies) {
    // Find items manufactured by this company
    const manufacturedItems = extractedData.items.items.filter(
      (item) => item.id_company === company.id
    );

    // Find vehicles manufactured by this company
    const manufacturedVehicles = extractedData.vehicles.vehicles.filter(
      (vehicle) => vehicle.id_company === company.id
    );

    // Create company description
    const companyText = `Company: ${company.name}
${company.nickname ? `Nickname: ${company.nickname}` : ""}
Industry: ${company.industry || "Unknown"}
${company.wiki ? `Information: ${company.wiki}` : ""}

Description:
${
  company.name
} is a corporation in the Star Citizen universe that specializes in ${
      company.industry || "various industries"
    }.
${
  company.is_item_manufacturer === 1
    ? "This company manufactures various items and equipment."
    : ""
}
${
  company.is_vehicle_manufacturer === 1
    ? "This company manufactures vehicles and spacecraft."
    : ""
}

${
  manufacturedItems.length > 0
    ? `Notable Items Manufactured (${manufacturedItems.length}):
${manufacturedItems
  .slice(0, 10)
  .map((item) => item.name)
  .join(", ")}${manufacturedItems.length > 10 ? "..." : ""}`
    : ""
}

${
  manufacturedVehicles.length > 0
    ? `Notable Vehicles Manufactured (${manufacturedVehicles.length}):
${manufacturedVehicles
  .slice(0, 10)
  .map((vehicle) => vehicle.name)
  .join(", ")}${manufacturedVehicles.length > 10 ? "..." : ""}`
    : ""
}`;

    chunks.push({
      id: `company-${company.id}`,
      text: companyText,
      metadata: {
        type: "company",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: company.id,
        name: company.name,
        industry: company.industry || "Unknown",
        isItemManufacturer: company.is_item_manufacturer === 1,
        isVehicleManufacturer: company.is_vehicle_manufacturer === 1,
        manufacturedItemsCount: manufacturedItems.length,
        manufacturedVehiclesCount: manufacturedVehicles.length,
        dateAdded: company.date_added,
        dateModified: company.date_modified,
      },
    });

    // Create separate chunks for company's vehicles if they have many
    if (manufacturedVehicles.length > 5) {
      const vehiclesText = `Vehicles Manufactured by ${company.name}:

${
  company.name
} is known for producing the following vehicles in the Star Citizen universe:

${manufacturedVehicles
  .map(
    (vehicle) =>
      `- ${vehicle.name}${
        vehicle.name_full && vehicle.name_full !== vehicle.name
          ? ` (${vehicle.name_full})`
          : ""
      }: 
   ${
     vehicle.is_spaceship === 1
       ? "Spaceship"
       : vehicle.is_ground_vehicle === 1
       ? "Ground Vehicle"
       : "Vehicle"
   }
   ${vehicle.scu > 0 ? `Cargo: ${vehicle.scu} SCU` : ""}
   ${vehicle.crew ? `Crew: ${vehicle.crew}` : ""}`
  )
  .join("\n\n")}

${
  company.nickname
    ? `${company.nickname} is known for their vehicles in the ${
        company.industry || "aerospace"
      } industry.`
    : ""
}`;

      chunks.push({
        id: `company-vehicles-${company.id}`,
        text: vehiclesText,
        metadata: {
          type: "company_vehicles",
          gameVersion: extractedData.metadata.gameVersion,
          entityId: company.id,
          name: `${company.name} Vehicles`,
          companyId: company.id,
          companyName: company.name,
          vehicleCount: manufacturedVehicles.length,
        },
      });
    }
  }

  return chunks;
}

/**
 * Generate chunks for vehicles in the Star Citizen universe
 */
export function generateVehiclesChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // Process each vehicle
  for (const vehicle of extractedData.vehicles.vehicles) {
    // Get the manufacturer
    const company = extractedData.core.companies.find(
      (c) => c.id === vehicle.id_company
    );

    // Get purchase prices
    const purchasePrices = extractedData.vehicles.allVehiclePurchasePrices
      .filter((p) => p.id_vehicle === vehicle.id)
      .sort((a, b) => (a.price_buy || 0) - (b.price_buy || 0));

    // Get rental prices
    const rentalPrices = extractedData.vehicles.allVehicleRentalPrices
      .filter((r) => r.id_vehicle === vehicle.id)
      .sort((a, b) => (a.price_rent || 0) - (b.price_rent || 0));

    // Get pledge store price
    const pledgePrice = extractedData.vehicles.vehiclePledgePrices.find(
      (p) => p.id_vehicle === vehicle.id
    );

    // Get loaner vehicles
    const loanerInfo = extractedData.vehicles.vehicleLoaners.find(
      (l) => l.id === vehicle.id
    );

    // Parse container sizes if available
    const containerSizes = vehicle.container_sizes
      ? vehicle.container_sizes.split(",").map((size) => size.trim())
      : [];

    // Generate role descriptions based on vehicle properties
    const roles: string[] = [];
    if (vehicle.is_cargo === 1) roles.push("Cargo Hauling");
    if (vehicle.is_mining === 1) roles.push("Mining");
    if (vehicle.is_salvage === 1) roles.push("Salvage");
    if (vehicle.is_repair === 1) roles.push("Repair");
    if (vehicle.is_refuel === 1) roles.push("Refueling");
    if (vehicle.is_medical === 1) roles.push("Medical");
    if (vehicle.is_passenger === 1) roles.push("Passenger Transport");
    if (vehicle.is_exploration === 1) roles.push("Exploration");
    if (vehicle.is_bomber === 1 || vehicle.is_interdiction === 1)
      roles.push("Combat");
    if (vehicle.is_racing === 1) roles.push("Racing");
    if (vehicle.is_stealth === 1) roles.push("Stealth Operations");
    if (vehicle.is_science === 1 || vehicle.is_research === 1)
      roles.push("Science/Research");
    if (vehicle.is_datarunner === 1) roles.push("Data Running");

    // Create vehicle description
    const vehicleText = `Vehicle: ${vehicle.name}${
      vehicle.name_full ? ` (${vehicle.name_full})` : ""
    }
Manufacturer: ${company?.name || "Unknown"}
Type: ${
      vehicle.is_spaceship === 1
        ? "Spacecraft"
        : vehicle.is_ground_vehicle === 1
        ? "Ground Vehicle"
        : "Vehicle"
    }
Status: ${
      vehicle.is_concept === 1
        ? "Concept (Not Yet Available In-Game)"
        : "Flight Ready"
    }
${
  vehicle.is_spaceship === 1 ? `Pad Size: ${vehicle.pad_type || "Unknown"}` : ""
}

Specifications:
${vehicle.length > 0 ? `Length: ${vehicle.length} meters` : ""}
${vehicle.width > 0 ? `Width: ${vehicle.width} meters` : ""}
${vehicle.height > 0 ? `Height: ${vehicle.height} meters` : ""}
${vehicle.mass > 0 ? `Mass: ${vehicle.mass} kg` : ""}
${vehicle.scu > 0 ? `Cargo Capacity: ${vehicle.scu} SCU` : "No cargo capacity"}
${
  containerSizes.length > 0
    ? `Container Sizes: ${containerSizes.join(", ")} SCU`
    : ""
}
${vehicle.crew ? `Crew: ${vehicle.crew}` : ""}
${vehicle.fuel_quantum > 0 ? `Quantum Fuel: ${vehicle.fuel_quantum} SCU` : ""}
${
  vehicle.fuel_hydrogen > 0 ? `Hydrogen Fuel: ${vehicle.fuel_hydrogen} SCU` : ""
}

Roles: ${roles.length > 0 ? roles.join(", ") : "Multipurpose"}

Features:
${vehicle.is_hangar === 1 ? "- Has ship hangar for smaller craft" : ""}
${vehicle.is_docking === 1 ? "- Equipped with docking port" : ""}
${vehicle.is_loading_dock === 1 ? "- Has loading dock for cargo" : ""}
${vehicle.is_emp === 1 ? "- Equipped with EMP technology" : ""}
${vehicle.is_qed === 1 ? "- Equipped with Quantum Enforcement Device" : ""}
${vehicle.is_tractor_beam === 1 ? "- Equipped with tractor beam" : ""}
${
  vehicle.is_quantum_capable === 1
    ? "- Capable of quantum travel"
    : "- Not capable of quantum travel"
}

Acquisition:
${
  purchasePrices.length > 0 && purchasePrices[0].price_buy
    ? `In-game Purchase: From ${purchasePrices[0].price_buy.toLocaleString()} aUEC at ${
        purchasePrices[0].terminal_name
      }`
    : "Not available for purchase in-game"
}
${
  rentalPrices.length > 0 && rentalPrices[0].price_rent
    ? `In-game Rental: From ${rentalPrices[0].price_rent.toLocaleString()} aUEC at ${
        rentalPrices[0].terminal_name
      }`
    : "Not available for rental in-game"
}
${
  pledgePrice
    ? `Pledge Store: ${pledgePrice.price.toLocaleString()} ${
        pledgePrice.currency || "USD"
      }${pledgePrice.on_sale === 1 ? " (Currently on sale)" : ""}`
    : "Not currently available in the pledge store"
}
${
  loanerInfo && loanerInfo.loaners && loanerInfo.loaners.length > 0
    ? `Loaner Vehicles: ${loanerInfo.loaners.map((l) => l.name).join(", ")}`
    : ""
}

${vehicle.url_store ? `Pledge Store: ${vehicle.url_store}` : ""}
${vehicle.url_brochure ? `Brochure: ${vehicle.url_brochure}` : ""}
${vehicle.uuid ? `RSI UUID: ${vehicle.uuid}` : ""}`;

    chunks.push({
      id: `vehicle-${vehicle.id}`,
      text: vehicleText,
      metadata: {
        type: "vehicle",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: vehicle.id,
        name: vehicle.name,
        manufacturerId: vehicle.id_company,
        manufacturerName: company?.name || "Unknown",
        isSpaceship: vehicle.is_spaceship === 1,
        isGroundVehicle: vehicle.is_ground_vehicle === 1,
        isConcept: vehicle.is_concept === 1,
        cargo: vehicle.scu,
        roles: roles,
        padType: vehicle.pad_type || "Unknown",
        purchaseAvailable: purchasePrices.length > 0,
        rentalAvailable: rentalPrices.length > 0,
        pledgeAvailable: pledgePrice?.on_sale === 1,
        dateAdded: vehicle.date_added,
        dateModified: vehicle.date_modified,
      },
    });

    // Create purchase locations chunk if there are many
    if (purchasePrices.length > 1) {
      const purchaseLocationsText = `Purchase Locations for ${vehicle.name}:

${vehicle.name} can be purchased at the following locations in Star Citizen:

${purchasePrices
  .map(
    (p) => `- ${p.terminal_name}: ${(p.price_buy || 0).toLocaleString()} aUEC`
  )
  .join("\n")}

Note that prices may vary based on your reputation and market conditions.
Game Version: ${extractedData.metadata.gameVersion}`;

      chunks.push({
        id: `vehicle-purchase-${vehicle.id}`,
        text: purchaseLocationsText,
        metadata: {
          type: "vehicle_purchase_locations",
          gameVersion: extractedData.metadata.gameVersion,
          entityId: vehicle.id,
          name: `${vehicle.name} Purchase Locations`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          locationCount: purchasePrices.length,
          bestPrice:
            purchasePrices.length > 0
              ? purchasePrices[0].price_buy || null
              : null,
        },
      });
    }

    // Create rental locations chunk if there are many
    if (rentalPrices.length > 1) {
      const rentalLocationsText = `Rental Locations for ${vehicle.name}:

${vehicle.name} can be rented at the following locations in Star Citizen:

${rentalPrices
  .map(
    (p) => `- ${p.terminal_name}: ${(p.price_rent || 0).toLocaleString()} aUEC`
  )
  .join("\n")}

Renting can be a cost-effective way to try out a vehicle before purchasing.
Game Version: ${extractedData.metadata.gameVersion}`;

      chunks.push({
        id: `vehicle-rental-${vehicle.id}`,
        text: rentalLocationsText,
        metadata: {
          type: "vehicle_rental_locations",
          gameVersion: extractedData.metadata.gameVersion,
          entityId: vehicle.id,
          name: `${vehicle.name} Rental Locations`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          locationCount: rentalPrices.length,
          bestPrice:
            rentalPrices.length > 0 ? rentalPrices[0].price_rent || null : null,
        },
      });
    }
  }

  // Create ship comparison chunks by category
  const shipCategories = new Map<
    string,
    (typeof extractedData.vehicles.vehicles)[0][]
  >();

  // Function to determine category
  const getShipCategory = (
    vehicle: (typeof extractedData.vehicles.vehicles)[0]
  ): string => {
    if (vehicle.is_ground_vehicle === 1) return "Ground Vehicles";
    if (vehicle.is_bomber === 1) return "Bombers";
    if (vehicle.is_interdiction === 1 || vehicle.is_emp === 1)
      return "Fighters";
    if (vehicle.is_cargo === 1) {
      if (vehicle.scu > 500) return "Large Haulers";
      if (vehicle.scu > 100) return "Medium Haulers";
      return "Small Haulers";
    }
    if (vehicle.is_mining === 1) return "Mining Ships";
    if (vehicle.is_medical === 1) return "Medical Ships";
    if (vehicle.is_racing === 1) return "Racing Ships";
    if (vehicle.is_exploration === 1) return "Exploration Ships";
    if (vehicle.is_salvage === 1) return "Salvage Ships";
    if (vehicle.is_passenger === 1) return "Passenger Ships";
    return "Multipurpose Ships";
  };

  // Group ships by category
  for (const vehicle of extractedData.vehicles.vehicles) {
    if (vehicle.is_addon === 1) continue; // Skip add-ons

    const category = getShipCategory(vehicle);
    if (!shipCategories.has(category)) {
      shipCategories.set(category, []);
    }
    shipCategories.get(category)?.push(vehicle);
  }

  // Create a chunk for each category
  for (const [category, vehicles] of shipCategories.entries()) {
    if (vehicles.length < 2) continue; // Need at least 2 to compare

    // Sort by size/price/capability depending on category
    if (category.includes("Haulers")) {
      vehicles.sort((a, b) => b.scu - a.scu);
    } else {
      vehicles.sort((a, b) => a.name.localeCompare(b.name));
    }

    const comparisonText = `${category} Comparison Guide:

This guide compares the various ${category.toLowerCase()} available in Star Citizen.

${vehicles
  .map((v) => {
    const company = extractedData.core.companies.find(
      (c) => c.id === v.id_company
    );
    const purchasePrices =
      extractedData.vehicles.allVehiclePurchasePrices.filter(
        (p) => p.id_vehicle === v.id
      );
    const bestPrice =
      purchasePrices.length > 0
        ? Math.min(...purchasePrices.map((p) => p.price_buy || 0))
        : null;

    return `- ${v.name} (${company?.name || "Unknown"})
  Size: ${v.pad_type || "Unknown"}
  Cargo: ${v.scu} SCU
  Crew: ${v.crew || "Unknown"}
  ${
    bestPrice
      ? `In-game price: ${bestPrice.toLocaleString()} aUEC`
      : "Not available for in-game purchase"
  }
  Status: ${v.is_concept === 1 ? "Concept" : "Flight Ready"}`;
  })
  .join("\n\n")}

Game Version: ${extractedData.metadata.gameVersion}`;

    chunks.push({
      id: `vehicle-category-${category.replace(/\s+/g, "-").toLowerCase()}`,
      text: comparisonText,
      metadata: {
        type: "vehicle_category",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: 0,
        name: `${category} Comparison`,
        category: category,
        vehicleCount: vehicles.length,
      },
    });
  }

  return chunks;
}

/**
 * Generate chunks for items in the Star Citizen universe
 */
export function generateItemsChunks(
  extractedData: UEXPlatformDataExtraction,
  maps: UEXPlatformDataExtractionMaps
): EmbeddingChunk[] {
  const chunks: EmbeddingChunk[] = [];

  // Group items by category
  const itemsByCategory = new Map<
    number,
    (typeof extractedData.items.items)[0][]
  >();

  for (const item of extractedData.items.items) {
    if (!itemsByCategory.has(item.id_category)) {
      itemsByCategory.set(item.id_category, []);
    }
    itemsByCategory.get(item.id_category)?.push(item);
  }

  // Process each item
  for (const item of extractedData.items.items) {
    // Get the category
    const category = extractedData.items.categories.find(
      (c) => c.id === item.id_category
    );

    // Get the company
    const company = extractedData.core.companies.find(
      (c) => c.id === item.id_company
    );

    // Get the vehicle (if applicable)
    const vehicle = item.id_vehicle
      ? extractedData.vehicles.vehicles.find((v) => v.id === item.id_vehicle)
      : null;

    // Get price data
    const prices = extractedData.items.allItemPrices
      .filter((p) => p.id_item === item.id)
      .sort((a, b) => (a.price_buy || 0) - (b.price_buy || 0));

    // Get attributes
    const attributes: Array<{ name: string; value: string; unit: string }> = [];

    // Check if item attributes is an array of arrays or a single array
    if (Array.isArray(extractedData.items.itemAttributes)) {
      for (const attrItem of extractedData.items.itemAttributes) {
        if (Array.isArray(attrItem)) {
          // Handle array of arrays
          const itemAttrs = attrItem.filter((attr) => attr.id_item === item.id);
          for (const attr of itemAttrs) {
            attributes.push({
              name: attr.attribute_name,
              value: attr.value || "",
              unit: attr.unit || "",
            });
          }
        } else if (attrItem.id_item === item.id) {
          // Handle flat array
          attributes.push({
            name: attrItem.attribute_name,
            value: attrItem.value || "",
            unit: attrItem.unit || "",
          });
        }
      }
    }

    // Create item description
    const itemText = `Item: ${item.name}
Category: ${category?.name || "Unknown"}
Manufacturer: ${company?.name || "Unknown"}
${vehicle ? `Used in Vehicle: ${vehicle.name}` : ""}

Description:
${item.name} is a${/^[aeiou]/i.test(category?.name?.[0] || "") ? "n" : ""} ${
      category?.name || "item"
    } in Star Citizen${company ? ` manufactured by ${company.name}` : ""}.
${item.section ? `Section: ${item.section}` : ""}
${
  item.is_exclusive_pledge === 1
    ? "This item is exclusive to pledge store purchases."
    : ""
}
${
  item.is_exclusive_subscriber === 1
    ? "This item is exclusive to subscribers."
    : ""
}
${
  item.is_exclusive_concierge === 1
    ? "This item is exclusive to concierge members."
    : ""
}

${
  attributes.length > 0
    ? `Specifications:
${attributes
  .map(
    (attr) => `- ${attr.name}: ${attr.value}${attr.unit ? ` ${attr.unit}` : ""}`
  )
  .join("\n")}`
    : ""
}

Acquisition:
${
  prices.length > 0 && prices[0].price_buy
    ? `Available for purchase in-game from ${prices[0].price_buy.toLocaleString()} aUEC at ${
        prices[0].terminal_name
      }`
    : "Not available for purchase in-game"
}
${item.url_store ? `Pledge Store: ${item.url_store}` : ""}
${item.uuid ? `RSI UUID: ${item.uuid}` : ""}`;

    chunks.push({
      id: `item-${item.id}`,
      text: itemText,
      metadata: {
        type: "item",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: item.id,
        name: item.name,
        categoryId: item.id_category,
        categoryName: category?.name || "Unknown",
        companyId: item.id_company,
        companyName: company?.name || "Unknown",
        vehicleId: item.id_vehicle,
        vehicleName: vehicle?.name,
        isPledgeExclusive: item.is_exclusive_pledge === 1,
        isSubscriberExclusive: item.is_exclusive_subscriber === 1,
        isConciergeExclusive: item.is_exclusive_concierge === 1,
        purchaseAvailable: prices.length > 0,
        attributeCount: attributes.length,
        dateAdded: item.date_added,
        dateModified: item.date_modified,
      },
    });

    // Create purchase locations chunk if there are many
    if (prices.length > 1) {
      const purchaseLocationsText = `Purchase Locations for ${item.name}:

${item.name} can be purchased at the following locations in Star Citizen:

${prices
  .map(
    (p) => `- ${p.terminal_name}: ${(p.price_buy || 0).toLocaleString()} aUEC`
  )
  .join("\n")}

Note that prices may vary based on your reputation and market conditions.
Game Version: ${extractedData.metadata.gameVersion}`;

      chunks.push({
        id: `item-purchase-${item.id}`,
        text: purchaseLocationsText,
        metadata: {
          type: "item_purchase_locations",
          gameVersion: extractedData.metadata.gameVersion,
          entityId: item.id,
          name: `${item.name} Purchase Locations`,
          itemId: item.id,
          itemName: item.name,
          locationCount: prices.length,
          bestPrice: prices.length > 0 ? prices[0].price_buy || null : null,
        },
      });
    }
  }

  // Create category overview chunks
  for (const [categoryId, items] of itemsByCategory.entries()) {
    const category = extractedData.items.categories.find(
      (c) => c.id === categoryId
    );
    if (!category) continue;

    // Sort items alphabetically
    items.sort((a, b) => a.name.localeCompare(b.name));

    const categoryText = `${category.name} in Star Citizen:

This is a list of ${
      items.length
    } ${category.name.toLowerCase()} available in Star Citizen.

${items
  .slice(0, 50)
  .map((item) => {
    const company = extractedData.core.companies.find(
      (c) => c.id === item.id_company
    );
    return `- ${item.name}${company ? ` (${company.name})` : ""}`;
  })
  .join("\n")}
${
  items.length > 50
    ? `\n...and ${items.length - 50} more ${category.name.toLowerCase()}.`
    : ""
}

Game Version: ${extractedData.metadata.gameVersion}`;

    chunks.push({
      id: `item-category-${categoryId}`,
      text: categoryText,
      metadata: {
        type: "item_category",
        gameVersion: extractedData.metadata.gameVersion,
        entityId: categoryId,
        name: `${category.name} List`,
        categoryId: categoryId,
        categoryName: category.name,
        itemCount: items.length,
      },
    });
  }

  return chunks;
}
