import { buildCommands } from "./build_command.ts";
import { getConfigObject } from "./config_reader.ts";
import { display } from "./display.ts";
import type { ConfigType, CommandResult } from "./types/index.ts";

export const orchestrator = (
  command: string,
  packages: string | string[],
  options: any,
) => {
  if (command === "install") {
    display(
      `Installing packages... ${options.pkgJson ? "from package.json" : (packages as string[]).join(", ")}`,
      "info",
    );
    //Getting package installation commands
    getConfigObject(packages, options.pkgJson).then(
      (config: ConfigType[] | CommandResult[]) => {
        if (config.length == 0) {
          display("No configuration found", "error");
        }

        //if config object is from the config file
        if ((config as ConfigType[])[0]?.packages) {
          const commands = buildCommands(config as ConfigType[]);
          console.log(commands);
        } else {
          //if it from package.json
          console.log(config);
        }
      },
    );
  }
};
