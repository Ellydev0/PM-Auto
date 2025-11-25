import { describe, it, expect } from "vitest";
import { buildCommands, buildUninstallCommands } from "../src/build_command.js";
import type { ConfigType } from "../src/types/index.js";

describe("buildCommand", () => {
  const mockConfig: ConfigType[] = [
    {
      name: "vite",
      packageManager: "npm",
      packages: [
        { command: "vite@latest", interactive: true },
        { command: "gsap@latest", interactive: false },
      ],
    },
  ];
  it("builds an installation command", () => {
    const command = buildCommands(mockConfig);
    expect(command).toEqual([
      {
        name: "vite",
        interactive: ["npx vite@latest"],
        nonInteractive: ["npm install gsap@latest"],
      },
    ]);
  });

  it("builds an uninstallation command", () => {
    const command = buildUninstallCommands(mockConfig);
    expect(command).toEqual([
      {
        name: "vite",
        interactive: [],
        nonInteractive: ["npm uninstall gsap@latest"],
      },
    ]);
  });
});
