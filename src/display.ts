/**
 * Display a message with a specified type.
 *
 * @param text - The message to display.
 * @param type - The type of message to display to determine the color.
 */

export const display = (
  text: string,
  type: "error" | "success" | "warning" | "info" | "loading" | "",
) => {
  switch (type) {
    case "error":
      console.error(text);
      process.exit(1);
    case "success":
      console.log(text);
      process.exit(0);
    case "warning":
      console.warn(text);
      break;
    case "info":
      console.info(text);
      break;
    case "loading":
      console.log(`Loading... ${text}`);
      break;
    default:
      console.log(text);
  }
};
