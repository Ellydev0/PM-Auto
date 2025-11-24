/**
 * Display a message with a specified type.
 *
 * @param text - The message to display.
 * @param type - The type of message to display to determine the color.
 */
import { log, spinner, note } from "@clack/prompts";
import chalk from "chalk";

type DisplayType = "error" | "success" | "warning" | "info" | "loading" | "";

const s = spinner();

export const display = (text: string, type: DisplayType) => {
  switch (type) {
    case "error":
      log.error(chalk.red(text));
      process.exit(1);
    case "success":
      s.stop(chalk.green(text));
      break;
    case "warning":
      log.warn(chalk.yellow(text));
      break;
    case "info":
      log.info(chalk.blue(text));
      break;
    case "loading":
      s.start(text);
      break;
    default:
      log.message(text);
  }
};

export const stopSpinner = (text: string, code: number = 0) => {
  if (code === 0) {
    s.stop(chalk.green(text));
  } else {
    s.stop(chalk.red(text));
  }
};
