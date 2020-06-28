import * as log from "https://deno.land/std/log/mod.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>;
}

const launches = new Map<number, Launch>();

// custom configuration with 2 loggers (the default and `tasks` loggers)
// await log.setup({
//   handlers: {
//     console: new log.handlers.ConsoleHandler("DEBUG"),
//   },
//   loggers: {
//     // configure default logger available via short-hand methods above
//     default: {
//       level: "DEBUG",
//       handlers: ["console"],
//     },
//   },
// });

export async function downloadLaunchData() {
  log.info("downloading launch data...");
  log.warning("THIS IS A WARNING");
  const response = await fetch("https://api.spacexdata.com/v3/launches", {
    method: "GET",
  });

  if (!response.ok) {
    log.warning("Problem downloading launch data.");
    throw new Error("Launch data download failed.");
  }

  const launchData = await response.json();
  // console.log(launchData);
  for (const launch of launchData) {
    const payloads = launch["rocket"]["second_stage"]["payloads"];
    const customers = _.flatMap(payloads, (payload: any) => {
      return payload["customers"];
    });

    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      customers: customers,
    };

    launches.set(flightData.flightNumber, flightData);

    // Because flightData is object, we use JSON.stringify to turn it in to the string
    log.info(JSON.stringify(flightData));
  }
}

if (import.meta.main) {
  await downloadLaunchData();
  log.info(JSON.stringify(import.meta));
  log.info(`Downloaded data for ${launches.size} SpaceX launches.`);
}
