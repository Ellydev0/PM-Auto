#!/usr/bin/env node

import { Command } from "commander";
import { saveConfigPath } from "./config_path.ts";
import { display } from "./display.ts";
import { getConfigObject } from "./config_reader.ts";
import { buildCommands } from "./build_command.ts";
import type { CommandResult, ConfigType } from "./types/index.ts";
import { orchestrator } from "./orchestrator.ts";

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
  .command("install [packages...]")
  .description("Install packages")
  .option("-p, --pkg-json", "Install packages from package.json")
  .action((packages, options) => {
    orchestrator("install", packages, options);
  });

program.parse();
