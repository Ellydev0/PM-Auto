import fs from "fs/promises";
import { getConfigPath } from "./config_path.js";

import * as fsd from "fs";
import * as path from "path";
import type { CommandResult, ConfigType } from "./types/index.js";
import { display } from "./display.js";
import { confirm, isCancel, cancel } from "@clack/prompts";

type PackageManager = "npm" | "yarn" | "pnpm";

/**
 * Detect the package manager used in the project.
 */

export function detectPackageManager(
  projectPath: string = process.cwd(),
): PackageManager | void {
  // Check for lock files in order of specificity
  if (fsd.existsSync(path.join(projectPath, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (fsd.existsSync(path.join(projectPath, "yarn.lock"))) {
    return "yarn";
  }

  if (fsd.existsSync(path.join(projectPath, "package-lock.json"))) {
    return "npm";
  }

  // Default to npm if no lock file found
  display("No Lock File Found", "error");
}

/**
 * Gets the required packages from the config file, transforms into a js object and with the options given
 * it modifies the object and returns it
 */
export const getConfigObject = async (
  packages: string[],
  options?: any,
): Promise<ConfigType[] | CommandResult[]> => {
  if (!options.pkgJson) {
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
    let result: ConfigType[] = Object.values(configObject);

    //filter the packages the user wants to install
    if (packages.length > 0) {
      result = packages
        .map((pkgName) => {
          const found = result.find((pkg) => pkg.name === pkgName);
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
    //Add command to previous configured commands (-A/-add-command)
    if (options.addCommand) {
      result.forEach((config) => {
        config.packages.forEach((pkg) => {
          pkg.command = pkg.interactive
            ? pkg.command
            : pkg.command + " " + options.addCommand;
        });
      });
    }

    //Dry run - Display commands before execution
    if (options.dryRun) {
      display("Dry Run:", "info");
      result.forEach((config) => {
        display(`Package name -> ${config.name}`, "info");
        config.packages.forEach((pkg) => {
          display(`add ${pkg.command}`, "info");
        });
      });
      const continueWithInstall = await confirm({
        message: "Continue with installation?",
        initialValue: true,
      });

      if (isCancel(continueWithInstall)) {
        cancel("Operation cancelled.");
        process.exit(0);
      }

      if (!continueWithInstall) {
        display("Installation cancelled ", "success");
      }
    }

    return result;
  } else {
    //generate command for package.json
    const pm = detectPackageManager();

    const command = pm + " install";

    const result: CommandResult[] = [
      {
        name: "package.json",
        interactive: [],
        nonInteractive: [command],
      },
    ];

    return result;
  }
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
  let keys = Object.keys(configObject);

  keys.forEach((key) => {
    if (key === packageName) {
      const description = !configObject[key].description
        ? "No description"
        : configObject[key].description;
      display(`${packageName} - ${description}`, "info");
    }
  });
};
