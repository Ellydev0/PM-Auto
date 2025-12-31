import { beforeEach, describe, expect, it, vi } from "vitest";
import fs from "fs/promises";
import { display } from "../src/display.js";
import { getConfigObject } from "../src/config_reader.js";
import { getConfigPath } from "../src/config_path.js";
import type { ConfigType } from "../src/types/index.js";
import * as clack from "@clack/prompts";

vi.mock("fs/promises");
vi.mock("fs");
vi.mock("../src/config_path.js");
vi.mock("../src/display.js");
vi.mock("@clack/prompts");
vi.mock("../src/config_path.js");

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

  it("should display an error on invalid config file format", async () => {
    vi.mocked(getConfigPath).mockReturnValue("/mock/config.json");
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({ name: "help" }));

    await getConfigObject(["react"], {});
    expect(display).toHaveBeenCalledWith(
      expect.stringContaining("Invalid config file format"),
      "error",
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
});
