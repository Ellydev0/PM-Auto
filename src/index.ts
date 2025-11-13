#!/usr/bin/env node

import { Command } from "commander";
import { saveConfigPath } from "./config_path.ts";
import { display } from "./display.ts";
import { Orchestrator } from "./orchestrator.ts";
import { getConfigObject } from "./config_reader.ts";
import { buildCommands } from "./build_command.ts";
import type { ConfigType } from "./types/index.ts";

const program = new Command();

program
  .name("npm-auto")
  .version("1.0.0")
  .description("CLI for automated npm,yarn,pnpm package installation");

program
  .command("config <path>")
  .description("Set the config file path")
  .action((path) => {
    saveConfigPath(path);
  });

program
  .command("install <packages...>")
  .description("Install packages")
  .action((packages) => {
    display(`Installing packages... ${packages.join(", ")}`, "info");

    //Getting package installation commands
    getConfigObject(packages).then((config: ConfigType[]) => {
      if (!config[0]) {
        display("No configuration found", "error");
      }
      const commands = buildCommands(config);
      console.log(commands);
    });
  });

program.parse();
