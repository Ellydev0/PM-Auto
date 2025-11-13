export interface ConfigType {
  name: string;
  packageManager: string;
  packages: { name: string; interactive: boolean }[];
}

export interface PackageType {
  name: string;
  interactive: boolean;
}
