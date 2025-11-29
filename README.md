# PM-Auto

**Stop typing the same npm install commands over and over.**

PM-Auto is a CLI tool that lets you define your tech stack presets once and install them anywhere with a single command. No more trying so hard to remember package names, no more repetitive typing—just fast, consistent project setup.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Why PM-Auto?](#why-pm-auto)
- [Commands](#commands)
  - [pm-auto install](#pm-auto-install)
  - [pm-auto uninstall](#pm-auto-uninstall)
  - [pm-auto config](#pm-auto-config)
- [Configuration](#configuration)
  - [Config Structure](#config-structure)
  - [Config Fields](#config-fields)
  - [Real-World Examples](#real-world-examples)
  - [Important Notes](#important-notes)
  - [Config Tips](#config-tips)
- [Global Options](#global-options)
- [Use Cases](#use-cases)
- [Requirements](#requirements)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Contributors](#contributors)

```bash
# Instead of this every time...
npm install react react-dom
npm install -D @types/react @types/react-dom
npm install vite @vitejs/plugin-react
npm install three @react-three/fiber gsap

# Do this once
pm-auto install
```

## Features

- 🚀 **One-command setup** - Install your entire tech stack instantly
- 📦 **Reusable presets** - Define stacks once, use across all projects
- 🔧 **Flexible package managers** - Works with npm, yarn, and pnpm
- ⚡ **Save time** - No more copying package lists or checking old projects
- 🎯 **Project-specific** - Different stacks for different project types

## Installation

```bash
npm install -g pm-auto
# or
pnpm add -g pm-auto
# or
yarn global add pm-auto
```

## Quick Start

**1. Create a config file** (e.g., `config.json`):

```json
{
  "InstallVite": {
    "name": "vite",
    "description": "Vite configuration",
    "packageManager": "npm",
    "packages": [
      {
        "command": "create-vite@latest my-app",
        "interactive": true
      }
    ]
  },

  "Next.js": {
    "name": "next",
    "description": "Next.js configuration",
    "packageManager": "pnpm",
    "packages": [
      {
        "command": "three --save-dev",
        "interactive": false
      },
      {
        "command": "@react-three/drei",
        "interactive": false
      },
      {
        "command": "framer-motion",
        "interactive": false
      },
      {
        "command": "create-next-app@latest my-app",
        "interactive": true
      }
    ]
  }
}

```

**2. Set your config path:**

```bash
pm-auto config ./config.json
```

**3. Install your stack:**

```bash
pm-auto install vite
```

That's it! The vite package from your config is installed automatically.

## Why PM-Auto?

### Before PM-Auto

```bash
# Setting up a new React project
npm install react react-dom
npm install -D @types/react @types/react-dom
npm install vite @vitejs/plugin-react
npm install three @react-three/fiber
npm install gsap
npm install -D @types/three
# ... did I forget anything?
```

### With PM-Auto

```bash
pm-auto install
# Done. ✨
```

## Commands

### `pm-auto install`

Install packages from your configured presets.

```bash
pm-auto install|i|add [options] [packages...]
```

**Options:**

- `-p, --pkg-json` - Install all packages from package.json
- `-A, --add-command <command>` - Add custom flags to all install commands
- `-D, --dry-run` - Preview commands without executing them
- `-h, --help` - Display help

**Examples:**

```bash
# Install everything from your config
pm-auto install

# Install specific packages to all presets
pm-auto install vite next

# Install from existing package.json
pm-auto install --pkg-json

# Preview what would be installed
pm-auto install --dry-run

# Add custom flags for non interactive commands(e.g., for peer dependency issues)
pm-auto install vite --add-command "--legacy-peer-deps"
```

### `pm-auto uninstall`

Remove packages from configured presets.

```bash
pm-auto uninstall|u|remove [options] <packages...>
```

**Options:**

- `-A, --add-command <command>` - Add custom flags to uninstall commands
- `-h, --help` - Display help

**Examples:**

```bash
# Uninstall single package
pm-auto uninstall vite

# Uninstall multiple packages
pm-auto uninstall vite next

# Force uninstall for non interactive commands
pm-auto uninstall vite --add-command "--force"
```

### `pm-auto config`

Set the path to your configuration file.

```bash
pm-auto config <path>
```

**Examples:**

```bash
# Set config with relative path
pm-auto config ./pm-auto-config.json

```

**Note:** The config path is stored persistently. If you move your config file, run `pm-auto config <new-path>` again.

### `pm-auto list`
List all packages from the config file
```bash
pm-auto list|ls
```
**Options:**

- `-D, --desc <command>` - Display packages description
- `-h, --help` - Display help

**Examples:**

```bash
# List all presets
pm-auto list

```

### `pm-auto describe`
Display description of the package
```bash
pm-auto describe <package-name>
```
**Options:**

- `-h, --help` - Display help

**Examples:**

```bash
# List all presets
pm-auto describe vite

```
### `pm-auto config-path`

Display path to the config file
```bash
pm-auto config-path|cp
```
**Options:**

- `-h, --help` - Display help

**Examples:**

```bash
# List all presets
pm-auto config-path

```


## Configuration

Create a JSON config file to define your tech stack presets.

### Config Structure

```json
{
  "Key": {
    "name": "preset-name",
    "description": "Description of the preset",
    "packageManager": "npm",
    "packages": [
      {
        "command": "package-name",
        "interactive": false
      }
    ]
  }
}
```

### Config Fields
- **`Key`** - Identifier for the preset (it can be anything)
- **`name`** - The preset name (should be simple for easy remembrance)
- **`description`** - Description of the preset
- **`packageManager`** - Package manager to use: `npm`, `yarn`, or `pnpm`
- **`packages`** - Array of package configurations
  - **`command`** - Package name(s) and flags (e.g., `lodash`, `typescript --save-dev`, `react react-dom`)
  - **`interactive`** - Set to `true` for commands requiring user input (e.g., `create-vite@latest my-app`, `create-next-app@latest`)

### Real-World Examples

**Full-Stack TypeScript Setup:**

```json
{
  "fullstack-ts": {
    "name": "fullstack-ts",
    "description": "Full-stack TypeScript setup with Express and TypeScript",
    "packageManager": "npm",
    "packages": [
      {
        "command": "typescript ts-node --save-dev",
        "interactive": false
      },
      {
        "command": "@types/node --save-dev",
        "interactive": false
      },
      {
        "command": "express dotenv cors helmet",
        "interactive": false
      },
      {
        "command": "@types/express --save-dev",
        "interactive": false
      }
    ]
  }
}
```

**Three.js + React Project:**

```json
{
  "threejs-react": {
    "name": "threejs-react",
    "description": "Three.js + React project setup",
    "packageManager": "pnpm",
    "packages": [
      {
        "command": "three @react-three/fiber @react-three/drei",
        "interactive": false
      },
      {
        "command": "@types/three --save-dev",
        "interactive": false
      },
      {
        "command": "gsap leva",
        "interactive": false
      }
    ]
  }
}
```

**Interactive commands:**
Set `"interactive": true` for commands that require user input during installation, such as:

- `create-next-app@latest my-app`
- `create-vite@latest my-project`
- `create-react-app my-app`

### Config Tips

1. **Group related packages** - Combine packages that are always installed together in one command (e.g., `react react-dom gsap`)
2. **Use descriptive names** - Name presets by purpose: `api-starter`, `frontend-base`, `testing-setup`
3. **Multiple presets** - Create different presets for different project types in the same config
4. **Version control** - Commit your config file to share stacks across your team

## Global Options

- `-V, --version` - Show PM-Auto version
- `-h, --help` - Display help

## Use Cases

### Quick Project Setup

Start new projects with your preferred stack instantly, no setup scripts needed.

### Team Consistency

Share your config file with teammates so everyone uses the same packages and versions.

### Testing Compatibility

Quickly test if your package works across different package managers.

### Learning & Experimentation

Save configs for different frameworks you're learning—switch between stacks effortlessly.

## Requirements

- Node.js 14.0.0 or higher
- npm, yarn, or pnpm installed

## Troubleshooting

**Config not found:**

- Verify the config path is correct: `pm-auto config ./your-config.json`
- Use absolute paths if relative paths aren't working
- Ensure the config file is valid JSON

**Packages not installing:**

- Run with `--dry-run` to preview commands
- Check that package names are spelled correctly
- Verify your package manager is installed and accessible

**Interactive commands hanging:**

- Set `"interactive": true` for commands like `create-vite@latest`
- These commands will prompt for user input during installation

## Contributing

We welcome contributions! Here's how:

1. **Fork & clone:**

   ```bash
   git clone https://github.com/Ellydev0/pm-auto.git
   cd pm-auto
   npm install
   ```

2. **Create a branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes:**
   - Write clean, readable code
   - Follow existing conventions

4. **Commit with conventional format:**
   ```bash
   git commit -m "feat: add your feature"
   ```

   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation
   - `refactor:` - Code refactoring
   - `test:` - Tests
   - `chore:` - Maintenance

5. **Push & open PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Reporting Issues

Found a bug? Have a suggestion?

1. Check if the issue already exists
2. Create a new issue with:
   - Clear description
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Environment (OS, Node version, package manager)

## Contributors

Thank you to all the contributors who have helped make PM-Auto exist! 🎉
<!-- ALL-CONTRIBUTORS-LIST:START -->
[Elliot Otoijagha](https://github.com/Ellydev0)

[Triumph Aidenojie](https://github.com/WebsTechne)


Want to see your name here? Check out our [Contributing](#contributing) section!

**Save time. Code more.** Get started with PM-Auto today! 🚀
