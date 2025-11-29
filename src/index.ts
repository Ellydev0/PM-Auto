#!/usr/bin/env node

import { Command } from "commander";
import { getConfigPath, saveConfigPath } from "./config_path.js";
import { intro } from "@clack/prompts";
import { orchestrator } from "./orchestrator.js";
import chalk from "chalk";
import { getConfigKeys, getPackageDescription } from "./config_reader.js";
import { display } from "./display.js";

intro(chalk.inverse(" pm-auto "));

const program = new Command();

program
  .name("pm-auto")
  .version("1.0.5")
  .description(
    "A CLI tool to define and install your tech stack presets with one command.",
  );

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
    "Install packages using the detected package manager (Aliases: add, i)",
  )
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
  .alias("remove")
  .alias("u")
  .alias("un")
  .description(
    "Remove packages using the detected package manager (Aliases: remove, u, un)",
  )
  .option(
    "-A, --add-command <command>",
    "Add a custom command to all installation commands from config file",
  )
  .action((packages, options) => {
    orchestrator("uninstall", packages, options);
  });

//Listing config packages
program
  .command("list")
  .alias("ls")
  .description("List all packages from the config file")
  .option("-D, --desc", "Display packages description", false)
  .action((options) => {
    getConfigKeys(options);
  });

//Displaying config details
program
  .command("describe <package>")
  .alias("desc")
  .description("Display description of the package")
  .action((packages) => {
    getPackageDescription(packages);
  });

//get config path
program
  .command("config-path")
  .alias("cp")
  .description("Display the path to the configuration file")
  .action(() => {
    const path = getConfigPath();
    display(`Config Path: ${path}`, "info");
  });

program.parse();
