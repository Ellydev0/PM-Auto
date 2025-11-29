import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { display } from "../src/display.js";
import { log, spinner } from "@clack/prompts";

// Mock the dependencies
vi.mock("@clack/prompts", () => ({
  log: {
    error: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    message: vi.fn(),
  },
  spinner: vi.fn(),
}));

vi.mock("chalk", () => ({
  default: {
    red: vi.fn((text) => `red:${text}`),
    green: vi.fn((text) => `green:${text}`),
    yellow: vi.fn((text) => `yellow:${text}`),
    blue: vi.fn((text) => `blue:${text}`),
  },
}));

describe("display", () => {
  let mockSpinner: any;
  let exitSpy: any;

  beforeEach(() => {
    mockSpinner = {
      stop: vi.fn(),
      start: vi.fn(),
    };
    vi.mocked(spinner).mockReturnValue(mockSpinner);
    exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
    exitSpy.mockRestore();
  });

  it("should display error message and exit process", () => {
    display("Error text", "error");
    expect(log.error).toHaveBeenCalledWith("red:Error text");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("should display success message", () => {
    display("Success text", "success");
    expect(log.success).toHaveBeenCalledWith("green:Success text");
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("should display warning message", () => {
    display("Warning text", "warning");
    expect(log.warn).toHaveBeenCalledWith("yellow:Warning text");
  });

  it("should display info message", () => {
    display("Info text", "info");
    expect(log.info).toHaveBeenCalledWith("blue:Info text");
  });

  it("should start spinner for loading type", () => {
    const result = display("Loading text", "loading");
    expect(mockSpinner.start).toHaveBeenCalledWith("Loading text");
    expect(result).toBe(mockSpinner);
  });

  it("should display plain message for default/empty type", () => {
    display("Plain text", "");
    expect(log.message).toHaveBeenCalledWith("Plain text");
  });

  it("should display plain message when type is not recognized", () => {
    display("Unknown text", "unknown" as any);
    expect(log.message).toHaveBeenCalledWith("Unknown text");
  });
});
