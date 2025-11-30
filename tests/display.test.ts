import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { display, s } from "../src/display.js";
import { log, spinner } from "@clack/prompts";
import chalk from "chalk";

// Mock dependencies
vi.mock("@clack/prompts", () => ({
  log: {
    error: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    message: vi.fn(),
  },
  spinner: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
  })),
}));

vi.mock("chalk", () => ({
  default: {
    red: vi.fn((text) => `red:${text}`),
    green: vi.fn((text) => `green:${text}`),
    yellow: vi.fn((text) => `yellow:${text}`),
    blue: vi.fn((text) => `blue:${text}`),
  },
}));

describe("display function", () => {
  let processExitSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    processExitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => ({}) as never);
  });

  afterEach(() => {
    processExitSpy.mockRestore();
  });

  it("should display error message and exit process", () => {
    display("Error occurred", "error");

    expect(chalk.red).toHaveBeenCalledWith("Error occurred");
    expect(log.error).toHaveBeenCalledWith("red:Error occurred");
    expect(processExitSpy).toHaveBeenCalledWith(0);
  });

  it("should display success message", () => {
    display("Operation successful", "success");

    expect(chalk.green).toHaveBeenCalledWith("Operation successful");
    expect(log.success).toHaveBeenCalledWith("green:Operation successful");
  });

  it("should display warning message", () => {
    display("Warning message", "warning");

    expect(chalk.yellow).toHaveBeenCalledWith("Warning message");
    expect(log.warn).toHaveBeenCalledWith("yellow:Warning message");
  });

  it("should display info message", () => {
    display("Info message", "info");

    expect(chalk.blue).toHaveBeenCalledWith("Info message");
    expect(log.info).toHaveBeenCalledWith("blue:Info message");
  });

  it("should start spinner for loading type", () => {
    const result = display("Loading...", "loading");

    expect(s.start).toHaveBeenCalledWith("Loading...");
    expect(result).toBe(s);
  });

  it("should display default message for empty type", () => {
    display("Default message", "");

    expect(log.message).toHaveBeenCalledWith("Default message");
  });

  it("should display default message for unrecognized type", () => {
    display("Random message", "unknown" as any);

    expect(log.message).toHaveBeenCalledWith("Random message");
  });
});
