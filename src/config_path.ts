import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { display } from "./display.js";

const SETTINGS_DIR = path.join(os.homedir(), ".pm-auto");
const SETTINGS_FILE = path.join(SETTINGS_DIR, "settings.json");

interface Settings {
  configPath?: string;
}

export function saveConfigPath(configPath: string): void {
  // Create directory if it doesn't exist
  if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
  }

  //check if file exists
  try {
    const real = fs.realpathSync(configPath);
    const settings: Settings = { configPath: real };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));

    display(`Config file path saved: ${configPath}`, "success");
  } catch (err: any) {
    display(`Error saving config file: ${err.message}`, "error");
  }
}

export function getConfigPath(): string | void {
  //check if settings exists
  if (!fs.existsSync(SETTINGS_FILE)) {
    display(
      "Run `pm-auto config <path>`, where <path> is the path to your config file",
      "info",
    );
    display("Config file path not set", "error");
  }

  try {
    const data = fs.readFileSync(SETTINGS_FILE, "utf8");
    const settings: Settings = JSON.parse(data);
    return settings.configPath || "";
  } catch (error: any) {
    display(`Error reading config file path: ${error.message}`, "error");
  }
}
