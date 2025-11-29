import { log, spinner } from "@clack/prompts";
import chalk from "chalk";

type DisplayType = "error" | "success" | "warning" | "info" | "loading" | "";

export const display = (text: string, type: DisplayType) => {
  switch (type) {
    case "error":
      log.error(chalk.red(text));
      process.exit(0);

    case "success":
      log.success(chalk.green(text)); // Use log.success instead
      break;

    case "warning":
      log.warn(chalk.yellow(text));
      break;

    case "info":
      log.info(chalk.blue(text));
      break;

    case "loading":
      const s = spinner();
      s.start(text);
      return s; // Return spinner so it can be stopped later

    default:
      log.message(text);
  }
};
