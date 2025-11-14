import type { ConfigType, PackageType, CommandResult } from "./types/index.ts";

/**
 * Build commands for each project based on its configuration.
 */

export function buildCommands(projects: ConfigType[]) {
  // Initialize arrays properly

  const commandResult: CommandResult[] = [];
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

    commandResult.push(result);
  }

  return commandResult;
}
