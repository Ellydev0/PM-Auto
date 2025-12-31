# PM-Auto (Package Manager Automation)

**Install your entire project stack with one command.**

PM-Auto is a CLI that lets you define reusable package presets (your usual tech stacks) and install them anywhere instantly. No more copy-pasting npm commands or forgetting dependencies.

If you regularly set up the same kind of projects, PM-Auto saves real time.

---

## Why PM-Auto Exists (Plain English)

Most devs do this:

```bash
npm install react react-dom
npm install -D @types/react @types/react-dom
npm install vite @vitejs/plugin-react
npm install three @react-three/fiber gsap
```

Every. Single. Time.

PM-Auto lets you define that once in a config file, then reuse it forever:

```bash
pm-auto install vite
```

Done.

---

## Core Concepts

PM-Auto is built around **presets**.

A **preset** is:

* A name (e.g. `vite`, `next`, `threejs-react`)
* A package manager (`npm`, `pnpm`, or `yarn`)
* A list of packages to be installed

You store presets in a JSON config file.
PM-Auto reads that file and runs the commands for you.

---

## Installation

```bash
npm install -g pm-auto
# or
pnpm add -g pm-auto
# or
yarn global add pm-auto
```

Verify:

```bash
pm-auto -V
```

---

## Quick Start (Minimal Path)

### 1. Create a config file

Create `config.json`:

```json
{
  "example": {
    "presetName": "example",
    "description": "A sample configuration demonstrating all options for PM-Auto",
    "packageManager": "bun",
    "packages": [
      {
        "command": "create-next-app",
        "interactive": true,
        "dev": false, //optional
        "version": "latest", //optional
        "flags": ["."] //optional
      },
    ]
  }
}
```

### 2. Register the config path

```bash
pm-auto config ./config.json
```

(⚠️ Always make sure to register the config path before using PM-Auto and anytime you make changes to the config path.)

### 3. Install a preset

```bash
pm-auto install example
```

PM-Auto executes each command using the specified package manager.

---

## Commands Overview

### `pm-auto install`

Install presets from your config.

```bash
pm-auto install [preset-name]
```

Common options:

* `--dry-run` → preview commands without running them
* `--add-flags "<flags>"` → append flags to non-interactive installs

Example:

```bash
pm-auto install example --dry-run
```

---

### `pm-auto uninstall`

Uninstall packages defined in presets.

```bash
pm-auto uninstall example
```

Use `--dry-run` to preview.

---

### `pm-auto list`

List all presets in your config.

```bash
pm-auto list
```

---

### `pm-auto describe`

Show details about a specific preset.

```bash
pm-auto describe example
```

---

### `pm-auto config`

Set or update the config file path.

```bash
pm-auto config ./relative/path/to/config.json
```

---

### `pm-auto config-path`

Show the currently active config path.

```bash
pm-auto config-path
```

---

## Configuration

PM-Auto uses a JSON config file to define **presets**.

When you run:

```bash
pm-auto config ./config.json
```

PM-Auto will **automatically prepend an example preset** to the file whether it’s empty or not. This is intentional — the example acts as inline documentation so you immediately see how presets are structured.

You are expected to **edit or delete the example** once you understand it.

---

### Full Config Structure (All Options)

```json
{
  "example": {
    "presetName": "example",
    "description": "A sample configuration demonstrating all options for PM-Auto",
    "packageManager": "bun",
    "packages": [
      {
        "command": "create-next-app",
        "interactive": true,
        "dev": false,
        "version": "latest",
        "flags": ["."]
      },
      {
        "command": "shadcn",
        "interactive": true,
        "dev": false,
        "version": "latest",
        "flags": ["init"]
      },
      {
        "command": "gsap",
        "interactive": false,
        "dev": false,
        "version": "3.11.4",
        "flags": ["--peer-deps"]
      },
      {
        "command": "@react-three/fiber",
        "interactive": false,
        "dev": false
      },
      {
        "command": "clsx",
        "interactive": false,
        "dev": false
      },
      {
        "command": "@types/three",
        "interactive": false,
        "dev": true
      }
    ]
  }
}
```

---

### Config Fields Explained (Plain English)

#### Preset Level

* **`example`** → internal key (can be anything)
* **`presetName`** → name you pass to the CLI (`pm-auto install example`)
* **`description`** → shown in `list` and `describe`
* **`packageManager`** → `npm`, `pnpm`, `yarn`, or `bun`
* **`packages`** → ordered list of install commands

#### Package Level

Each entry in `packages` represents **one install command**.

* **`command`** → package or tool name
* **`interactive`** → `true` if the command prompts for input
* **`dev`** → install as dev dependency
* **`version`** → exact version (`"3.11.4"`, `"latest"`, or omitted)
* **`flags`** → extra CLI flags or arguments

PM-Auto builds the final command for you.

Example output:

```bash
npm install gsap@3.11.4 -D
```

---

## Real Examples

### Three.js + React

```json
{
  "threejs-react": {
    "name": "threejs-react",
    "description": "Three.js + React setup",
    "packageManager": "pnpm",
    "packages": [
      { "command": "three @react-three/fiber @react-three/drei", "interactive": false },
      { "command": "@types/three --save-dev", "interactive": false },
      { "command": "gsap leva", "interactive": false }
    ]
  }
}
```

## Full‑Stack TypeScript

```json
{
  "fullstack-ts": {
    "name": "fullstack-ts",
    "description": "Express + TypeScript backend",
    "packageManager": "npm",
    "packages": [
      { "command": "typescript ts-node --save-dev", "interactive": false },
      { "command": "@types/node --save-dev", "interactive": false },
      { "command": "express dotenv cors helmet", "interactive": false }
    ]
  }
}
```

---

## Best Practices

* Group packages you always install together
* Keep preset names short (`vite`, `next`, `api`)

---

## Common Issues

**Nothing installs**

* Check config path: `pm-auto config-path`
* Validate JSON formatting

**Command hangs**

* You forgot `"interactive": true`

**Wrong package manager**

* Double-check `packageManager` field

---

## Requirements

* Node.js 14+
* npm, pnpm, yarn 2+, or bun

---

If you set up projects more than twice, it’s already worth it.
