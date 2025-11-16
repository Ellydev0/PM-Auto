import { buildCommands, buildUninstallCommands } from "./build_command.js";
import { getConfigObject } from "./config_reader.js";
import { display } from "./display.js";
import { install } from "./install.js";
import type { ConfigType } from "./types/index.js";

//Check if the value is an array of ConfigType objects
function isConfigTypeArray(value: unknown): value is ConfigType[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "packages" in item &&
        Array.isArray((item as any).packages),
    )
  );
}

export const orchestrator = (
  command: string,
  packages: string[],
  options?: any,
) => {
  if (command === "install") {
    display(
      `Installing packages... ${options.pkgJson ? "from package.json" : (packages as string[]).join(", ")}`,
      "info",
    );

    getConfigObject(packages, options).then(async (config) => {
      if (config.length === 0) {
        display("No configuration found", "error");
        return;
      }

      if (isConfigTypeArray(config)) {
        const commands = buildCommands(config);
        await install(commands);
        display("✅ Packages installed successfully", "success");
        process.stdout.write("\x07");
      } else {
        await install(config);

        display(
          "✅ Packages from package.json installed successfully",
          "success",
        );
      }
    });
  } else {
    display(
      `Uninstalling packages... ${(packages as string[]).join(", ")}`,
      "info",
    );

    getConfigObject(packages, options).then(async (config) => {
      if (config.length === 0) {
        display("No configuration found", "error");
        return;
      }

      if (isConfigTypeArray(config)) {
        const commands = buildUninstallCommands(config);
        await install(commands);
        display("✅ Packages uninstalled successfully", "success");
      }
    });
  }
};
