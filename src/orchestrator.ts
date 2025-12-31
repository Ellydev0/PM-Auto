import {
  buildInstallCommands,
  buildUninstallCommands,
} from "./build_command.js";
import { getConfigObject } from "./config_reader.js";
import { display } from "./display.js";
import { runCommands } from "./run_commands.js";
import type { ConfigType } from "./types/index.js";
import { outro } from "@clack/prompts";

//Controls installation and uninstallation of packages
export const orchestrator = (
  command: string,
  packages: string[],
  options?: any,
) => {
  if (command === "install") {
    display(
      `Installing packages... ${(packages as string[]).join(", ")}`,
      "info",
    );
    const start = performance.now();
    getConfigObject(packages, options).then(async (config) => {
      if (config.length === 0) {
        display("No configuration found", "error");
        return;
      }

      const commands = buildInstallCommands(config);

      await runCommands(commands);
      outro("Done!");
      const end = performance.now();
      display(`Installation took ${end - start}ms`, "info");
      display("Packages installed successfully", "success");
    });
  } else {
    display(
      `Uninstalling packages... ${(packages as string[]).join(", ")}`,
      "info",
    );

    const start = performance.now();
    getConfigObject(packages, options).then(async (config) => {
      if (config.length === 0) {
        display("No configuration found", "error");
        return;
      }

      const commands = buildUninstallCommands(config);
      await runCommands(commands);
      outro("Done!");
      const end = performance.now();
      display(`Uninstallation took ${end - start}ms`, "info");
      display("Packages uninstalled successfully", "success");
    });
  }
};
