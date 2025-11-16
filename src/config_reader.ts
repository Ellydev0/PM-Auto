import fs from "fs/promises";
import { getConfigPath } from "./config_path.js";

import * as fsd from "fs";
import * as path from "path";
import type { CommandResult, ConfigType } from "./types/index.js";
import { display } from "./display.js";
import { confirm } from "@inquirer/prompts";

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
 * Get the installation commands from the config file, transforms into a js object and with the options given
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
      display(`File not found ${error}`, "error");
    }
    const configObject = JSON.parse(configContent);
    let result: ConfigType[] = Object.values(configObject);

    //filter the packages the user wants to install
    if (packages.length > 0) {
      result = packages.map((pkg) => {
        if (!configObject[pkg]) {
          display(
            `Package ${pkg} not found in the configuration file`,
            "warning",
          );
        }
        return configObject[pkg];
      });
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
        default: true,
      });

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
