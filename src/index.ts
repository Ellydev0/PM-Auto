#!/usr/bin/env node

import { Command } from "commander";
import { saveConfigPath } from "./config_path.js";
import { orchestrator } from "./orchestrator.js";

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
  .option(
    "-A, --add-command <command>",
    "Add a custom command to all installation commands from config file",
  )
  .option("-D, --dry-run", "Dry run - Display commands before execution")
  .action((packages, options) => {
    orchestrator("install", packages, options);
  });

program
  .command("uninstall <packages...>")
  .description("Uninstall packages")
  .option(
    "-A, --add-command <command>",
    "Add a custom command to all installation commands from config file",
  )
  .action((packages, options) => {
    orchestrator("uninstall", packages, options);
  });

program.parse();
