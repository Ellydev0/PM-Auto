import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { display } from "./display.js";

const SETTINGS_DIR = path.join(os.homedir(), ".pm-auto");
const SETTINGS_FILE = path.join(SETTINGS_DIR, "settings.json");
const EXAMPLE_CONFIG_TEXT = `{
  "example": {
    "presetName": "example",
    "description": "A sample configuration demonstrating all options for PM-Auto",
    "packageManager": "pnpm",
    "packages": [
      {
        "command": "vite",
        "interactive": true,
        "dev": false,
        "version": "latest",
        "flags": ["."]
      },
      {
        "command": "shadcn",
        "interactive": true,
        "dev": false,
        "version": "latest"
      },
      {
        "command": "gsap",
        "interactive": false,
        "dev": false,
        "version": "3.11.4",
        "flags": ["--peer-deps"]
      },
      {
        "command": "@react-three/fiber",
        "interactive": false,
        "dev": true,
        "version": "1.0.0",
        "flags": []
      },
      {
        "command": "clsx",
        "interactive": false,
        "dev": false
      }
    ]
  }
}
`;

interface Settings {
  configPath?: string;
}

export function prependToFile(filePath: string, text: string) {
  display(`Prepending to example to file: ${filePath}`, "info");

  // Read old content if file exists
  const oldContent = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : "";

  // Write new content at the top
  if (!oldContent.includes(text)) {
    fs.writeFileSync(filePath, text + oldContent, "utf8");
  }
  display(`Example prepended successfully: ${filePath}`, "success");
}

export function saveConfigPath(configPath: string): void {
  // Create directory if it doesn't exist
  if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
  }

  try {
    const real = fs.realpathSync(configPath);
    const settings: Settings = { configPath: real };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));

    display(`Config file path saved: ${configPath}`, "info");
    prependToFile(real, EXAMPLE_CONFIG_TEXT);
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
