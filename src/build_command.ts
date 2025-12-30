import type { ConfigType, PackageType, CommandResult } from "./types/index.js";

/**
 * Build commands from project configurations.
 */

/**
 * Extracts the package name from a raw command string
 * Removes version and any flags (starts with -)
 */

export function cleanCommand(rawCommand: string): string {
  // Split by spaces and pick first segment that doesn't start with "-"
  const parts = rawCommand.trim().split(" ");
  for (const part of parts) {
    if (!part.startsWith("-")) {
      // Remove version if exists

      const atIndex = part.indexOf("@");
      if (atIndex > 0) {
        return part.slice(0, atIndex).trim();
      } else {
        return part.trim();
      }
    }
  }
  return ""; // fallback
}

export function buildInstallCommands(projects: ConfigType[]) {
  // Initialize arrays properly

  const commandArray: CommandResult[] = [];
  for (const project of projects) {
    const { packageManager, packages } = project;

    const commandPrefixes = {
      npm: {
        install: "npm install",
        run: "npx",
        dev: "-D",
      },
      pnpm: {
        install: "pnpm add",
        run: "pnpm dlx",
        dev: "-D",
      },
      yarn: {
        install: "yarn add",
        run: "yarn dlx",
        dev: "-D",
      },
      bun: {
        install: "bun add",
        run: "bunx",
        dev: "-d",
      },
    };

    const manager =
      commandPrefixes[packageManager as keyof typeof commandPrefixes] ||
      commandPrefixes.npm;

    const result: CommandResult = {
      presetName: project.presetName,
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
      result.interactive.push(
        `${manager.run} ${cleanCommand(pkg.command)}${pkg.version ? `@${pkg.version}` : ""} ${pkg.flags?.join(" ") || ""}`.trim(),
      );
    });

    // Batch all non-interactive packages
    if (nonInteractive.length > 0) {
      const batchPackages: string[] = [];

      nonInteractive.forEach((pkg) => {
        const base = cleanCommand(pkg.command); // package name or full command
        let cmd = base;

        // Append version if present
        if (pkg.version) {
          cmd += `@${pkg.version}`;
        }

        // Append dev flag if true (mapped per manager)
        if (pkg.dev) {
          cmd += ` ${manager.dev}`;
        }

        // Append any extra flags
        if (pkg.flags?.length) {
          cmd += ` ${pkg.flags.join(" ")}`;
        }

        batchPackages.push(cmd);
      });

      // Push a single install command for all batchable packages
      if (batchPackages.length > 0) {
        result.nonInteractive.push(
          `${manager.install} ${batchPackages.join(" ")}`,
        );
      }
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
        uninstall: "npm uninstall",
      },
      pnpm: {
        uninstall: "pnpm remove",
      },
      yarn: {
        uninstall: "yarn remove",
      },
      bun: {
        uninstall: "bun remove",
      },
    };

    const manager =
      commandPrefixes[packageManager as keyof typeof commandPrefixes] ||
      commandPrefixes.npm;

    const result: CommandResult = {
      presetName: project.presetName,
      interactive: [],
      nonInteractive: [],
    };

    // Separate interactive from non-interactive packages
    const nonInteractive: PackageType[] = [];

    if (packages) {
      packages.forEach((pkg) => {
        if (!pkg.interactive) {
          nonInteractive.push(pkg);
        }
      });
    }

    // Batch all non-interactive packages into ONE command
    if (nonInteractive.length > 0) {
      const packageNames = nonInteractive
        .map((pkg) => cleanCommand(pkg.command))
        .join(" ");
      result.nonInteractive.push(`${manager.uninstall} ${packageNames}`);
    }

    commandArray.push(result);
  }

  return commandArray;
}
