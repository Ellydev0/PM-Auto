import { orchestrator } from "./src/orchestrator.js";

// Mock display to see what happens
// We can't easily mock the module here without jest, but we can run it and see output.

console.log("Starting reproduction...");
orchestrator("install", ["non-existent-preset"], {});
console.log("Orchestrator called.");
