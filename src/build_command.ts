import type { ConfigType, PackageType } from "./types/index.ts";

interface BuildCommandResult {
  name: string;
  interactive: string[];
  nonInteractive: string[];
}

/**
 * Build commands for each project based on its configuration.
 */

export function buildCommands(projects: ConfigType[]) {
  // Initialize arrays properly

  const commandBank: BuildCommandResult[] = [];
  for (const project of projects) {
    const { packageManager, packages } = project;

    const commands = {
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
      commands[packageManager as keyof typeof commands] || commands.npm;

    const result: BuildCommandResult = {
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
      result.interactive.push(`${manager.run} ${pkg.name}`);
    });

    // Batch all non-interactive packages into ONE command
    if (nonInteractive.length > 0) {
      const packageNames = nonInteractive.map((pkg) => pkg.name).join(" ");
      result.nonInteractive.push(`${manager.install} ${packageNames}`);
    }

    commandBank.push(result);
  }

  return commandBank;
}
