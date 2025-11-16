import { execa } from "execa";
import type { CommandResult } from "./types/index.js";
import { display } from "./display.js";

async function runCommand(command: string) {
  try {
    const [commandName, ...args] = command.split(" ");

    await execa(commandName as string, args, {
      stdio: "inherit",
    });
  } catch (error: any) {
    display(`Error:, ${error.message}`, "error");
  }
}

/**
 * Takes the interactive and non interactive command from each item in the CommandResult Array
 */
export async function install(commands: CommandResult[]) {
  try {
    for (const command of commands) {
      // Wait for all interactive commands to finish first
      if (command.interactive) {
        for (const interactiveCommand of command.interactive) {
          display(`Running command: ${interactiveCommand}`, "loading");
          await runCommand(interactiveCommand);
        }
      }

      // Then run non-interactive
      if (command.nonInteractive) {
        display(`Running command: ${command.nonInteractive[0]}`, "loading");
        await runCommand(command.nonInteractive[0] as string);
      }
    }
  } catch (error: any) {
    display(`Error: ${error.message}`, "error");
  }
}
