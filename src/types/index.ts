export interface ConfigType {
  presetName: string;
  description?: string;
  packageManager: string;
  packages: {
    command: string;
    interactive: boolean;
    dev?: boolean;
    flags?: string[];
    version?: string;
  }[];
}

export interface PackageType {
  command: string;
  interactive: boolean;
  dev?: boolean;
  flags?: string[];
  version?: string;
}

export interface CommandResult {
  presetName: string;
  interactive: string[];
  nonInteractive: string[];
}
