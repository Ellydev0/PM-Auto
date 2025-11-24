#!/usr/bin/env node

import { Command } from "commander";
import { saveConfigPath } from "./config_path.js";
import { intro, outro } from "@clack/prompts";
import { orchestrator } from "./orchestrator.js";
import chalk from "chalk";

intro(chalk.inverse(" pm-auto "));

const program = new Command();

program
  .name("pm-auto")
  .version("1.0.0")
  .description("Automated package manager installer for npm, yarn, and pnpm");

program
  .command("config <path>")
  .description("Set the path to the configuration file")
  .action((path) => {
    saveConfigPath(path);
  });

program
  .command("install [packages...]")
  .alias("add")
  .alias("i")
  .description(
    "Install packages using the detected package manager (Aliases: add, i)"
  )
  .option("-p, --pkg-json", "Install packages from package.json")
  .option(
    "-A, --add-command <command>",
    "Add a custom command to all installation commands from config file"
  )
  .option("-D, --dry-run", "Dry run - Display commands before execution")
  .action((packages, options) => {
    orchestrator("install", packages, options);
  });

program
  .command("uninstall <packages...>")
  .alias("remove")
  .alias("u")
  .alias("un")
  .description(
    "Remove packages using the detected package manager (Aliases: remove, u, un)"
  )
  .option(
    "-A, --add-command <command>",
    "Add a custom command to all installation commands from config file"
  )
  .action((packages, options) => {
    orchestrator("uninstall", packages, options);
  });

program.parse();
