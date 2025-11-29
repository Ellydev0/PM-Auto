import { describe, it, expect, vi, beforeEach } from "vitest";
import { execa } from "execa";
import { install } from "../src/install.js";
import * as display from "../src/display.js";
import type { CommandResult } from "../src/types/index.js";

// Mock dependencies
vi.mock("execa");
vi.mock("../src/display.js");

describe("install", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("runs interactive commands with inherit stdio", async () => {
    const commands: CommandResult[] = [
      {
        name: "test",
        interactive: ["npm init"],
        nonInteractive: [],
      },
    ];

    vi.mocked(execa).mockResolvedValue({} as any);

    await install(commands);

    expect(execa).toHaveBeenCalledWith("npm", ["init"], { stdio: "inherit" });
    expect(display.display).toHaveBeenCalledWith(expect.any(String), "info");
  });

  it("runs non-interactive commands with loading display", async () => {
    const commands: CommandResult[] = [
      {
        name: "test",
        interactive: [],
        nonInteractive: ["npm install react"],
      },
    ];

    vi.mocked(execa).mockResolvedValue({} as any);

    await install(commands);

    expect(display.display).toHaveBeenCalledWith(expect.any(String), "loading");
    expect(execa).toHaveBeenCalledWith("npm", ["install", "react"], {
      stdio: "inherit",
    });
  });

  it("runs interactive commands before non-interactive", async () => {
    const commands: CommandResult[] = [
      {
        name: "test",
        interactive: ["npm init"],
        nonInteractive: ["npm install"],
      },
    ];

    vi.mocked(execa).mockResolvedValue({} as any);

    await install(commands);

    // Check interactive was called first
    expect(execa).toHaveBeenNthCalledWith(1, "npm", ["init"], {
      stdio: "inherit",
    });
    expect(execa).toHaveBeenNthCalledWith(2, "npm", ["install"], {
      stdio: "inherit",
    });
  });

  it("handles multiple interactive commands sequentially", async () => {
    const commands: CommandResult[] = [
      {
        name: "test",
        interactive: ["npm init", "npx create-app"],
        nonInteractive: [],
      },
    ];

    vi.mocked(execa).mockResolvedValue({} as any);

    await install(commands);

    expect(execa).toHaveBeenCalledTimes(2);
    expect(execa).toHaveBeenNthCalledWith(1, "npm", ["init"], {
      stdio: "inherit",
    });
    expect(execa).toHaveBeenNthCalledWith(2, "npx", ["create-app"], {
      stdio: "inherit",
    });
  });

  it("handles command execution errors with stdout", async () => {
    const commands: CommandResult[] = [
      {
        name: "test",
        interactive: [],
        nonInteractive: ["npm install"],
      },
    ];

    const error = new Error("Command failed");
    (error as any).stdout = "stdout output";
    (error as any).stderr = "stderr output";

    vi.mocked(execa).mockRejectedValue(error);

    await install(commands);

    expect(display.display).toHaveBeenCalledWith("stdout output", "");
    expect(display.display).toHaveBeenCalledWith("stderr output", "error");
    expect(display.display).toHaveBeenCalledWith(
      expect.stringContaining("Command failed"),
      "error",
    );
  });

  it("handles command execution errors without stdout/stderr", async () => {
    const commands: CommandResult[] = [
      {
        name: "test",
        interactive: [],
        nonInteractive: ["npm install"],
      },
    ];

    vi.mocked(execa).mockRejectedValue(new Error("Command failed"));

    await install(commands);

    expect(display.display).toHaveBeenCalledWith(
      expect.stringContaining("Command failed"),
      "error",
    );
  });

  it("processes multiple CommandResult items in sequence", async () => {
    const commands: CommandResult[] = [
      {
        name: "react",
        interactive: [],
        nonInteractive: ["npm install react"],
      },
      {
        name: "vue",
        interactive: [],
        nonInteractive: ["npm install vue"],
      },
    ];

    vi.mocked(execa).mockResolvedValue({} as any);

    await install(commands);

    expect(execa).toHaveBeenCalledTimes(2);
    expect(execa).toHaveBeenCalledWith("npm", ["install", "react"], {
      stdio: "inherit",
    });
    expect(execa).toHaveBeenCalledWith("npm", ["install", "vue"], {
      stdio: "inherit",
    });
  });

  it("handles empty command arrays", async () => {
    const commands: CommandResult[] = [
      {
        name: "test",
        interactive: [],
        nonInteractive: [],
      },
    ];

    await install(commands);

    expect(execa).not.toHaveBeenCalled();
  });

  it("splits command string correctly with multiple args", async () => {
    const commands: CommandResult[] = [
      {
        name: "test",
        interactive: [],
        nonInteractive: ["npm install react --save-dev"],
      },
    ];

    vi.mocked(execa).mockResolvedValue({} as any);

    await install(commands);

    expect(execa).toHaveBeenCalledWith(
      "npm",
      ["install", "react", "--save-dev"],
      { stdio: "inherit" },
    );
  });
});
