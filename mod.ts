import * as log from "https://deno.land/std/log/mod.ts";

// custom configuration with 2 loggers (the default and `tasks` loggers)
await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    // configure default logger available via short-hand methods above
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

async function downloadLaunchData() {
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
}

await downloadLaunchData();
