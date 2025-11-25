import type { ConfigType, PackageType, CommandResult } from "./types/index.js";

/**
 * Build commands from project configurations.
 */

export function buildCommands(projects: ConfigType[]) {
  // Initialize arrays properly

  const commandArray: CommandResult[] = [];
  for (const project of projects) {
    const { packageManager, packages } = project;

    const commandPrefixes = {
      npm: {
        install: "npm install",
        run: "npx",
      },
      pnpm: {
        install: "pnpm add",
        run: "pnpm dlx",
      },
      yarn: {
        install: "yarn add",
        run: "yarn dlx",
      },
    };

    const manager =
      commandPrefixes[packageManager as keyof typeof commandPrefixes] ||
      commandPrefixes.npm;

    const result: CommandResult = {
      name: project.name,
      interactive: [],
      nonInteractive: [],
    };

    // Separate interactive from non-interactive packages
    const nonInteractive: PackageType[] = [];
    const interactive: PackageType[] = [];

    if (packages) {
      packages.forEach((pkg) => {
        if (pkg.interactive) {
          interactive.push(pkg);
        } else {
          nonInteractive.push(pkg);
        }
      });
    }

    // Add interactive packages as separate commands (sequential)
    interactive.forEach((pkg) => {
      result.interactive.push(`${manager.run} ${pkg.command}`);
    });

    // Batch all non-interactive packages into ONE command
    if (nonInteractive.length > 0) {
      const packageNames = nonInteractive.map((pkg) => pkg.command).join(" ");
      result.nonInteractive.push(`${manager.install} ${packageNames}`);
    }

    commandArray.push(result);
  }

  return commandArray;
}

export function buildUninstallCommands(projects: ConfigType[]) {
  const commandArray: CommandResult[] = [];
  for (const project of projects) {
    const { packageManager, packages } = project;

    const commandPrefixes = {
      npm: {
        install: "npm uninstall",
      },
      pnpm: {
        install: "pnpm uninstall",
      },
      yarn: {
        install: "yarn remove",
      },
    };

    const manager =
      commandPrefixes[packageManager as keyof typeof commandPrefixes] ||
      commandPrefixes.npm;

    const result: CommandResult = {
      name: project.name,
      interactive: [],
      nonInteractive: [],
    };

    // Separate interactive from non-interactive packages
    const nonInteractive: PackageType[] = [];
    // const interactive: PackageType[] = [];

    if (packages) {
      packages.forEach((pkg) => {
        if (!pkg.interactive) {
          nonInteractive.push(pkg);
        }
      });
    }

    // Batch all non-interactive packages into ONE command
    if (nonInteractive.length > 0) {
      const packageNames = nonInteractive.map((pkg) => pkg.command).join(" ");
      result.nonInteractive.push(`${manager.install} ${packageNames}`);
    }

    commandArray.push(result);
  }

  return commandArray;
}
