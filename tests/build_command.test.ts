import { describe, it, expect } from "vitest";
import {
  buildInstallCommands,
  buildUninstallCommands,
  cleanCommand,
} from "../src/build_command.js";
import type { CommandResult, ConfigType } from "../src/types/index.js";

describe("cleanCommand", () => {
  it("should return a string of a command stripped of its flags", () => {
    const commands = [
      "lodash@latest",
      "@react-three/fiber",
      "@three/types -D",
      "three --force",
    ];
    const results = [];
    for (const command of commands) {
      results.push(cleanCommand(command));
    }
    expect(results).toEqual([
      "lodash",
      "@react-three/fiber",
      "@three/types",
      "three",
    ]);
  });
});

const mockConfigs: Record<string, ConfigType[]> = {
  pnpm: [
    {
      presetName: "vite",
      packageManager: "pnpm",
      packages: [
        { command: "vite", interactive: true, version: "latest", flags: ["."] },
        { command: "gsap", interactive: false, version: "latest" },
        {
          command: "react-dom",
          interactive: false,
          version: "latest",
          dev: true,
          flags: ["--legacy-peer-deps"],
        },
        {
          command: "@react-three/fiber",
          interactive: false,
          version: "1.0.0",
          dev: true,
        },
        {
          command: "typescript",
          interactive: false,
          version: "latest",
          dev: true,
        },
        { command: "clsx", interactive: false },
        { command: "shadcn", interactive: true, version: "latest" },
      ],
    },
  ],
  yarn: [
    {
      presetName: "vite",
      packageManager: "yarn",
      packages: [
        { command: "vite", interactive: true, version: "latest", flags: ["."] },
        { command: "gsap", interactive: false, version: "latest" },
        {
          command: "react-dom",
          interactive: false,
          version: "latest",
          dev: true,
          flags: ["--peer-deps"],
        },
        {
          command: "@react-three/fiber",
          interactive: false,
          version: "1.0.0",
          dev: true,
        },
        {
          command: "typescript",
          interactive: false,
          version: "latest",
          dev: true,
        },
        { command: "clsx", interactive: false },
        { command: "shadcn", interactive: true, version: "latest" },
      ],
    },
  ],
  npm: [
    {
      presetName: "vite",
      packageManager: "npm",
      packages: [
        { command: "vite", interactive: true, version: "latest", flags: ["."] },
        { command: "gsap", interactive: false, version: "latest" },
        {
          command: "react-dom",
          interactive: false,
          version: "latest",
          dev: true,
          flags: ["--legacy-peer-deps"],
        },
        {
          command: "@react-three/fiber",
          interactive: false,
          version: "1.0.0",
          dev: true,
        },
        {
          command: "typescript",
          interactive: false,
          version: "latest",
          dev: true,
        },
        { command: "clsx", interactive: false },
        { command: "shadcn", interactive: true, version: "latest" },
      ],
    },
  ],
  bun: [
    {
      presetName: "vite",
      packageManager: "bun",
      packages: [
        { command: "vite", interactive: true, version: "latest", flags: ["."] },
        { command: "gsap", interactive: false, version: "latest" },
        {
          command: "react-dom",
          interactive: false,
          version: "latest",
          dev: true,
          flags: ["--peer-deps"],
        },
        {
          command: "@react-three/fiber",
          interactive: false,
          version: "1.0.0",
          dev: true,
        },
        {
          command: "typescript",
          interactive: false,
          version: "latest",
          dev: true,
        },
        { command: "clsx", interactive: false },
        { command: "shadcn", interactive: true, version: "latest" },
      ],
    },
  ],
};

const expectedInstall: Record<string, CommandResult[]> = {
  pnpm: [
    {
      presetName: "vite",
      interactive: ["pnpm dlx vite@latest .", "pnpm dlx shadcn@latest"],
      nonInteractive: [
        "pnpm add gsap@latest react-dom@latest -D --legacy-peer-deps @react-three/fiber@1.0.0 -D typescript@latest -D clsx",
      ],
    },
  ],
  yarn: [
    {
      presetName: "vite",
      interactive: ["yarn dlx vite@latest .", "yarn dlx shadcn@latest"],
      nonInteractive: [
        "yarn add gsap@latest react-dom@latest -D --peer-deps @react-three/fiber@1.0.0 -D typescript@latest -D clsx",
      ],
    },
  ],
  npm: [
    {
      presetName: "vite",
      interactive: ["npx vite@latest .", "npx shadcn@latest"],
      nonInteractive: [
        "npm install gsap@latest react-dom@latest -D --legacy-peer-deps @react-three/fiber@1.0.0 -D typescript@latest -D clsx",
      ],
    },
  ],
  bun: [
    {
      presetName: "vite",
      interactive: ["bunx vite@latest .", "bunx shadcn@latest"],
      nonInteractive: [
        "bun add gsap@latest react-dom@latest -d --peer-deps @react-three/fiber@1.0.0 -d typescript@latest -d clsx",
      ],
    },
  ],
};

const expectedUninstall: Record<string, CommandResult[]> = {
  pnpm: [
    {
      presetName: "vite",
      interactive: [],
      nonInteractive: [
        "pnpm remove gsap react-dom @react-three/fiber typescript clsx",
      ],
    },
  ],
  yarn: [
    {
      presetName: "vite",
      interactive: [],
      nonInteractive: [
        "yarn remove gsap react-dom @react-three/fiber typescript clsx",
      ],
    },
  ],
  npm: [
    {
      presetName: "vite",
      interactive: [],
      nonInteractive: [
        "npm uninstall gsap react-dom @react-three/fiber typescript clsx",
      ],
    },
  ],
  bun: [
    {
      presetName: "vite",
      interactive: [],
      nonInteractive: [
        "bun remove gsap react-dom @react-three/fiber typescript clsx",
      ],
    },
  ],
};

describe("buildCommand", () => {
  for (const pm of Object.keys(mockConfigs)) {
    it(`builds ${pm} installation command`, () => {
      const command = buildInstallCommands(mockConfigs[pm]);
      expect(command).toEqual(expectedInstall[pm]);
    });

    it(`builds ${pm} uninstallation command`, () => {
      const command = buildUninstallCommands(mockConfigs[pm]);
      expect(command).toEqual(expectedUninstall[pm]);
    });
  }
});
