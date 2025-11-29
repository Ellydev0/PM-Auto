import { execa } from "execa";
import type { CommandResult } from "./types/index.js";
import { display } from "./display.js";

async function runCommand(command: string, interactive: boolean = false) {
  try {
    const [commandName, ...args] = command.split(" ");

    if (interactive) {
      await execa(commandName as string, args, {
        stdio: "inherit",
      });
    } else {
      await execa(commandName as string, args, {
        stdio: "inherit",
      });
    }
  } catch (error: any) {
    // If pipe failed, we should show the output
    if (error.stdout) display(error.stdout, "");
    if (error.stderr) display(error.stderr, "error");
    display(`Error:, ${error.message}`, "error");
  }
}

/**
 * Install all commands
 */
export async function install(commands: CommandResult[]) {
  try {
    for (const command of commands) {
      // Wait for all interactive commands to finish first
      if (command.interactive) {
        for (const interactiveCommand of command.interactive) {
          display(`Running interactive command: ${interactiveCommand}`, "info");
          await runCommand(interactiveCommand, true);
        }
      }

      // Then run non-interactive
      if (command.nonInteractive.length > 0) {
        // For non-interactive, we show a spinner
        display(`Running command: ${command.nonInteractive[0]}`, "loading");
        await runCommand(command.nonInteractive[0] as string, false);
      }
    }
  } catch (error: any) {
    display(`Error: ${error.message}`, "error");
  }
}
