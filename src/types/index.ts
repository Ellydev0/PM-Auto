export interface ConfigType {
  name: string;
  description?: string;
  packageManager: string;
  packages: { command: string; interactive: boolean }[];
}

export interface PackageType {
  command: string;
  interactive: boolean;
}

export interface CommandResult {
  name: string;
  interactive: string[];
  nonInteractive: string[];
}
