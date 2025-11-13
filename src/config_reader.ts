import fs from "fs/promises";
import { getConfigPath } from "./config_path.ts";

/**
 * Get the config object based on the packages
 */
export const getConfigObject = async (
  packages: string[] | string,
  pkgJson?: boolean,
) => {
  if (!pkgJson) {
    const configPath = getConfigPath();

    //read config file content
    const configContent = await fs.readFile(configPath as string, "utf8");
    const configObject = JSON.parse(configContent);

    //get the packages
    if (packages instanceof Array) {
      const result = packages.map((pkg) => configObject[pkg]);
      return result;
    } else {
      const result = configObject[packages as string];
      return result;
    }
  }
};
