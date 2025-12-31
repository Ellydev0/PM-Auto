import fs from "fs/promises";
import { getConfigPath } from "./config_path.js";
import type { CommandResult, ConfigType } from "./types/index.js";
import { display } from "./display.js";
import { confirm, isCancel, cancel } from "@clack/prompts";

/**
 * Gets the required packages from the config file, transforms into a js object and with the options given
 * it modifies the object and returns it
 */

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

export const getConfigObject = async (
  packages: string[],
  options?: any,
): Promise<ConfigType[]> => {
  const configPath = getConfigPath();

  //read config file content
  let configContent = "";
  try {
    configContent = await fs.readFile(configPath as string, "utf8");
  } catch (error) {
    display(
      `File not found ${error} Try updating the config file path`,
      "error",
    );
  }

  const configObject = JSON.parse(configContent);

  let result: ConfigType[] = [];

  if (isConfigTypeArray(Object.values(configObject))) {
    result = Object.values(configObject);
  } else {
    display("Invalid config file format", "error");
  }

  //filter the packages the user wants to install
  if (packages.length > 0 && result.length > 0) {
    result = packages
      .map((pkgName) => {
        const found = result.find((pkg) => pkg.presetName === pkgName);
        if (!found) {
          display(`Package '${pkgName}' not found in config`, "warning");
        }
        return found;
      })
      .filter((pkg) => pkg !== undefined);
  }

  /*
   * Config object modification with the options given
   */

  //Add flags to previous configured flags (-A/-add-flags)
  if (options.addFlags) {
    result.forEach((config) => {
      config.packages.forEach((pkg) => {
        if (pkg.flags) {
          pkg.flags.push(pkg.interactive ? "" : options.addFlags);
        } else {
          pkg.flags = [pkg.interactive ? "" : options.addFlags];
        }
      });
    });
  }

  //Dry run - Display commands before execution
  if (options.dryRun) {
    display("Dry Run:", "info");
    result.forEach((config) => {
      display(`Package name -> ${config.presetName}`, "info");
      config.packages.forEach((pkg) => {
        display(`running ${pkg.command}`, "info");
      });
    });
    const continuation = await confirm({
      message: "Continue?",
      initialValue: true,
    });

    if (isCancel(continuation)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    if (!continuation) {
      display("Operation cancelled. ", "success");
      process.exit(0);
    }
  }

  return result;
};

export const getConfigKeys = async (options: any) => {
  const configPath = getConfigPath();

  //read config file content
  let configContent = "";
  try {
    configContent = await fs.readFile(configPath as string, "utf8");
  } catch (error) {
    display(
      `File not found ${error} Try updating the config file path`,
      "error",
    );
  }

  const configObject = JSON.parse(configContent);
  let keys = Object.keys(configObject);

  keys.forEach((key) => {
    if (options.desc) {
      const description = !configObject[key].description
        ? "No description"
        : configObject[key].description;
      display(`${key} - ${description}`, "info");
    } else {
      display(`${key}`, "info");
    }
  });
};

export const getPackageDescription = async (packageName: string) => {
  const configPath = getConfigPath();

  //read config file content
  let configContent = "";
  try {
    configContent = await fs.readFile(configPath as string, "utf8");
  } catch (error) {
    display(
      `File not found ${error} Try updating the config file path`,
      "error",
    );
  }

  const configObject = JSON.parse(configContent);
  const configObjectArray: ConfigType[] = Object.values(configObject);

  configObjectArray.forEach((configObject) => {
    if (configObject.presetName === packageName) {
      const description = !configObject.description
        ? "No description"
        : configObject.description;
      display(`${packageName} - ${description}`, "info");
    }
  });
};
