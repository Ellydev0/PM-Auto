import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import * as os from "os";
import { saveConfigPath, getConfigPath } from "../src/config_path.js";
import * as display from "../src/display.js";

const mocks = vi.hoisted(() => {
  return {
    homedir: vi.fn(() => "/mock/home"),
  };
});

// Mock modules FIRST
vi.mock("fs");
vi.mock("os", () => ({
  homedir: mocks.homedir,
}));
vi.mock("../src/display.js");

// NOW import the module under test AFTER mocks are configured

describe("Config Path Management", () => {
  const mockHomeDir = "/mock/home";
  const mockSettingsDir = "\\mock\\home\\.pm-auto";
  const mockSettingsFile = "\\mock\\home\\.pm-auto\\settings.json";

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(os.homedir).mockReturnValue(mockHomeDir);
  });

  describe("saveConfigPath", () => {
    it("creates directory and saves config path", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      vi.mocked(fs.realpathSync).mockReturnValue("\\real\\path\\config.json");

      saveConfigPath("./config.json");

      expect(fs.mkdirSync).toHaveBeenCalledWith(mockSettingsDir, {
        recursive: true,
      });
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        mockSettingsFile,
        expect.stringContaining('"configPath"'),
      );
      expect(display.display).toHaveBeenCalledWith(
        expect.any(String),
        "success",
      );
    });

    it("skips directory creation if exists", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.realpathSync).mockReturnValue("/real/path");

      saveConfigPath("/path");

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it("handles errors gracefully", () => {
      vi.mocked(fs.realpathSync).mockImplementation(() => {
        throw new Error("File not found");
      });

      saveConfigPath("/invalid/path");

      expect(display.display).toHaveBeenCalledWith(
        expect.stringContaining("File not found"),
        "error",
      );
    });
  });

  describe("getConfigPath", () => {
    it("returns config path when file exists", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({ configPath: "/saved/path" }),
      );

      const result = getConfigPath();

      expect(result).toBe("/saved/path");
    });

    it("shows error when settings file does not exist", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const result = getConfigPath();

      expect(display.display).toHaveBeenCalledWith(
        expect.stringContaining("Config file path not set"),
        "error",
      );
      expect(result).toBeUndefined();
    });

    it("handles JSON parse errors", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue("invalid json");

      getConfigPath();

      expect(display.display).toHaveBeenCalledWith(
        expect.stringContaining("Error reading"),
        "error",
      );
    });

    it("returns empty string if configPath is missing", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({}));

      const result = getConfigPath();

      expect(result).toBe("");
    });
  });
});
