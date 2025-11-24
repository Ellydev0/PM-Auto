import { execa } from "execa";
import type { CommandResult } from "./types/index.js";
import { display, stopSpinner } from "./display.js";

async function runCommand(command: string, interactive: boolean = false) {
  try {
    const [commandName, ...args] = command.split(" ");

    if (interactive) {
      // Stop spinner before interactive command
      stopSpinner("Starting interactive command...", 0);
      await execa(commandName as string, args, {
        stdio: "inherit",
      });
    } else {
      // For non-interactive, we can try to pipe, but if it's a long running install,
      // user might want to see output.
      // However, to fix the "never finishes" issue which might be due to input waiting,
      // we should probably use inherit but stop the spinner first.
      // Or use pipe and show output on error.
      // Let's try pipe first to keep the UI clean as requested.

      await execa(commandName as string, args, {
        stdio: "pipe",
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
 * Takes the interactive and non interactive command from each item in the CommandResult Array
 */
export async function install(commands: CommandResult[]) {
  try {
    for (const command of commands) {
      // Wait for all interactive commands to finish first
      if (command.interactive) {
        for (const interactiveCommand of command.interactive) {
          // Interactive commands need full terminal access
          // We don't start a spinner here, or we stop it immediately in runCommand
          // But better to just log info
          display(`Running interactive command: ${interactiveCommand}`, "info");
          await runCommand(interactiveCommand, true);
        }
      }

      // Then run non-interactive
      if (command.nonInteractive) {
        // For non-interactive, we show a spinner
        display(`Running command: ${command.nonInteractive[0]}`, "loading");
        await runCommand(command.nonInteractive[0] as string, false);
      }
    }
  } catch (error: any) {
    display(`Error: ${error.message}`, "error");
  }
}
