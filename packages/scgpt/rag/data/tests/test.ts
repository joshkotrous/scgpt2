import { generateExtractedDataChunks, getExtractionMaps } from "../chunk";
import { promises as fsPromises } from "fs";
import { UEXPlatformDataExtractionObject } from "../types";
import { extractUEXData } from "../extract";

const readFileName = "./output/uex-data-2025-03-02.json";
async function main() {
  try {
    // Extract data
    // const extractedData = await extractUEXData();

    // // Save extracted data to a file as backup
    // await fsPromises.writeFile(
    //   `./output/uex-data-${new Date().toISOString().split("T")[0]}.json`,
    //   JSON.stringify(extractedData, null, 2)
    // );
    const rawData = await fsPromises.readFile(readFileName, "utf-8");
    const parsedData = JSON.parse(rawData);
    const extractedData = UEXPlatformDataExtractionObject.parse(parsedData);
    const maps = getExtractionMaps(extractedData);
    const chunks = generateExtractedDataChunks(extractedData, maps);
    console.log(JSON.stringify(chunks, null, 2));
    await fsPromises.writeFile(
      `./output/uex-data-chunks-${new Date().toISOString().split("T")[0]}.json`,
      JSON.stringify(chunks, null, 2)
    );
    console.log(
      `Complete pipeline execution successful. Writted to ${`./output/uex-data-${
        new Date().toISOString().split("T")[0]
      }.json`}`
    );
  } catch (error) {
    console.error("Pipeline execution failed:", JSON.stringify(error, null, 2));
  }
}

main();
