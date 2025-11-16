/**
 * Display a message with a specified type.
 *
 * @param text - The message to display.
 * @param type - The type of message to display to determine the color.
 */

import chalk from "chalk";

export const display = (
  text: string,
  type: "error" | "success" | "warning" | "info" | "loading" | "",
) => {
  switch (type) {
    case "error":
      console.error(chalk.red(text));
      process.exit(1);
    case "success":
      console.log(chalk.green(text));
      process.exit(0);
    case "warning":
      console.warn(chalk.yellow(text));
      break;
    case "info":
      console.info(chalk.blue(text));
      break;
    case "loading":
      console.log(`Loading... ${text}`);
      break;
    default:
      console.log(text);
  }
};
