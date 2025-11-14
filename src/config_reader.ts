import fs from "fs/promises";
import { getConfigPath } from "./config_path.ts";

import * as fsd from "fs";
import * as path from "path";
import type { CommandResult, ConfigType } from "./types/index.ts";
import { display } from "./display.ts";

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
 * Get the command from config.json
 */
export const getConfigObject = async (
  packages: string[] | string,
  pkgJson?: boolean,
): Promise<ConfigType[] | CommandResult[]> => {
  if (!pkgJson) {
    const configPath = getConfigPath();

    //read config file content
    const configContent = await fs.readFile(configPath as string, "utf8");
    const configObject = JSON.parse(configContent);

    //get the packages
    if (packages instanceof Array) {
      const result: ConfigType[] = packages.map((pkg) => {
        if (!configObject[pkg]) {
          display(
            `Package ${pkg} not found in the configuration file`,
            "warning",
          );
        }
        return configObject[pkg];
      });
      return result;
    } else {
      const result = configObject[packages as string];
      return result;
    }
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
