import { describe, it, expect } from "vitest";
import { buildCommands, buildUninstallCommands } from "../src/build_command.js";
import type { ConfigType } from "../src/types/index.js";

describe("buildCommand", () => {
  const mockConfig: ConfigType[] = [
    {
      name: "vite",
      packageManager: "pnpm",
      packages: [
        { command: "vite@latest", interactive: true },
        { command: "gsap@latest", interactive: false },
        { command: "react-dom@latest --save-dev", interactive: false },
        { command: "lodash --save-dev", interactive: false },
        { command: "typescript@latest --save-dev", interactive: false },
        { command: "clsx", interactive: false },
        { command: "shadcn", interactive: true },
      ],
    },
  ];
  it("builds an installation command", () => {
    const command = buildCommands(mockConfig);
    expect(command).toEqual([
      {
        name: "vite",
        interactive: ["pnpm dlx vite@latest", "pnpm dlx shadcn"],
        nonInteractive: [
          "pnpm add react-dom@latest --save-dev",
          "pnpm add lodash --save-dev",
          "pnpm add typescript@latest --save-dev",
          "pnpm add gsap@latest clsx",
        ],
      },
    ]);
  });

  it("builds an uninstallation command", () => {
    const command = buildUninstallCommands(mockConfig);
    expect(command).toEqual([
      {
        name: "vite",
        interactive: [],
        nonInteractive: [
          "pnpm remove gsap@latest react-dom@latest lodash typescript@latest clsx",
        ],
      },
    ]);
  });
});
