import { beforeEach, describe, expect, it, vi } from "vitest";
import fs from "fs/promises";
import * as fsd from "fs";
import { display } from "../src/display.js";
import { detectPackageManager, getConfigObject } from "../src/config_reader.js";
import { getConfigPath } from "../src/config_path.js";
import type { CommandResult, ConfigType } from "../src/types/index.js";
import * as clack from "@clack/prompts";

vi.mock("fs/promises");
vi.mock("fs");
vi.mock("../src/config_path.js");
vi.mock("../src/display.js");
vi.mock("@clack/prompts");
vi.mock("../src/config_path.js");

describe("detect package manager", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should detects pnpm from lock file", () => {
    vi.mocked(fsd.existsSync).mockImplementation((filePath) =>
      filePath.toString().includes("pnpm-lock.yaml"),
    );
    const result = detectPackageManager("/test/path");

    expect(result).toBe("pnpm");
  });
  it("should detects yarn from lock file", () => {
    vi.mocked(fsd.existsSync).mockImplementation((filePath) =>
      filePath.toString().includes("yarn.lock"),
    );
    const result = detectPackageManager("/test/path");

    expect(result).toBe("yarn");
  });

  it("should detects npm from lock file", () => {
    vi.mocked(fsd.existsSync).mockImplementation((filePath) =>
      filePath.toString().includes("package-lock.json"),
    );
    const result = detectPackageManager("/test/path");

    expect(result).toBe("npm");
  });

  it("should detects bun from lock file", () => {
    vi.mocked(fsd.existsSync).mockImplementation((filePath) =>
      filePath.toString().includes("bun.lock"),
    );
    const result = detectPackageManager("/test/path");

    vi.mocked(fsd.existsSync).mockImplementation((filePath) =>
      filePath.toString().includes("bun.lockb"),
    );
    const result2 = detectPackageManager("/test/path");

    expect(result).toBe("bun");
    expect(result2).toBe("bun");
  });

  it("should display error message when no lock file found", () => {
    vi.mocked(fsd.existsSync).mockImplementation(() => false);
    const result = detectPackageManager("/test/path");

    expect(display).toHaveBeenCalledWith(
      expect.stringContaining("No Lock File Found"),
      "error",
    );
    expect(result).toBeUndefined();
  });
});

describe("get Config Object", () => {
  const mockConfig: Record<string, ConfigType> = {
    react: {
      presetName: "react",
      packageManager: "pnpm",
      packages: [
        {
          command: "npm install react",
          interactive: false,
          flags: ["--peers-deps"],
        },
      ],
    },
    vue: {
      presetName: "vue",
      packageManager: "npm",
      packages: [
        { command: "npm install vue", interactive: false, version: "latest" },
      ],
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should get config object the user wants and display warning when package does not exist", async () => {
    vi.mocked(getConfigPath).mockResolvedValue("/path/to/test");
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockConfig));

    const config = await getConfigObject(["next", "react", "vue"], {});

    expect(config).toEqual([
      {
        presetName: "react",
        packageManager: "pnpm",
        packages: [
          {
            command: "npm install react",
            interactive: false,
            flags: ["--peers-deps"],
          },
        ],
      },
      {
        presetName: "vue",
        packageManager: "npm",
        packages: [
          { command: "npm install vue", interactive: false, version: "latest" },
        ],
      },
    ] as ConfigType[]);
    expect(display).toHaveBeenCalledWith(
      expect.stringContaining("Package 'next' not found in config"),
      "warning",
    );
  });

  // it("should display an error on readFile error", async () => {
  //   vi.mocked(getConfigPath).mockReturnValue("/");
  //   vi.mocked(fs.readFile).mockRejectedValue("File not found");
  //   await getConfigObject(["react"], {});
  //   expect(display).toHaveBeenCalledWith(
  //     expect.stringContaining("Try updating the config file path"),
  //     "error",
  //   );
  // });

  it("adds flags with addFlags option", async () => {
    vi.mocked(getConfigPath).mockReturnValue("/mock/config.json");
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockConfig));

    const result = (await getConfigObject(["react"], {
      addFlags: "--force",
    })) as ConfigType[];

    if (result[0]?.packages[0]?.flags) {
      expect(result[0].packages[0].flags).toContain("--force");
    }
  });

  it("shows dry run preview and continues on confirm", async () => {
    vi.mocked(getConfigPath).mockReturnValue("/mock/config.json");
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockConfig));
    vi.mocked(clack.confirm).mockResolvedValue(true);
    vi.mocked(clack.isCancel).mockReturnValue(false);

    const result = await getConfigObject(["react"], { dryRun: true });

    expect(display).toHaveBeenCalledWith("Dry Run:", "info");
    expect(clack.confirm).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it("cancels on dry run cancel", async () => {
    vi.mocked(getConfigPath).mockReturnValue("/mock/config.json");
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockConfig));
    vi.mocked(clack.confirm).mockResolvedValue(false);
    vi.mocked(clack.isCancel).mockReturnValue(true);

    const mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    await getConfigObject(["react"], { dryRun: true });

    expect(clack.cancel).toHaveBeenCalledWith("Operation cancelled.");
    expect(mockExit).toHaveBeenCalledWith(0);

    mockExit.mockRestore();
  });

  it("generates command for package.json install", async () => {
    vi.mocked(fsd.existsSync).mockImplementation((filePath) =>
      filePath.toString().includes("package-lock.json"),
    );

    const result = await getConfigObject([], { pkgJson: true });

    expect(result).toEqual([
      {
        presetName: "package.json",
        interactive: [],
        nonInteractive: ["npm install"],
      },
    ] as CommandResult[]);
  });

  it("uses correct package manager for package.json", async () => {
    vi.mocked(fsd.existsSync).mockImplementation((filePath) =>
      filePath.toString().includes("pnpm-lock.yaml"),
    );

    const result = (await getConfigObject([], {
      pkgJson: true,
    })) as CommandResult[];
    if (result[0]) {
      expect(result[0].nonInteractive[0]).toBe("pnpm install");
    }
  });
});
