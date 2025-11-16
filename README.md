# PM-Auto

A CLI tool for automated npm, yarn, and pnpm package installation across multiple package managers.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Commands](#commands)
  - [install](#install)
  - [uninstall](#uninstall)
  - [config](#config)
- [Configuration](#configuration)
  - [Configuration File Structure](#configuration-file-structure)
  - [Configuration Properties](#configuration-properties)
  - [Setting Up Your Config](#setting-up-your-config)
- [Global Options](#global-options)
- [Use Cases](#use-cases)
- [Contributing](#contributing)

## Installation

```bash
npm install -g pm-auto
# or
pnpm add -g pm-auto
# or
yarn global add pm-auto
```

## Quick Start

1. **Create a configuration file** in any directory (e.g., `config.json` or `test.json`)

2. **Set the config file path** using a relative path from your current working directory:

```bash
# Example: If you're in C:\Users\admin\Documents and your config is test.json
C:\Users\admin\Documents> pm-auto config ./test.json

# Example: If your config is in a subdirectory
pm-auto config ./my-configs/config.json
```

3. **Start installing packages**:

```bash
# Install packages from your config
pm-auto install

# Install specific packages
pm-auto install express lodash
```

> **⚠️ Important:** If you move your config file to a different location, you must set the path again using `pm-auto config <new-path>`

## Commands

### `install`

Install packages across configured package managers.

```bash
pm-auto install [options] [packages...]
```

**Options:**

- `-p, --pkg-json` - Install all packages from package.json
- `-A, --add-command <command>` - Add a custom command to all installation commands from config file
- `-D, --dry-run` - Display commands before execution without running them
- `-h, --help` - Display help

**Examples:**

```bash
# Install single package
pm-auto install express

# Install multiple packages
pm-auto install express lodash axios

# Install from package.json
pm-auto install --pkg-json

# Dry run to see what would be executed
pm-auto install express --dry-run

# Add custom flag to all installations
pm-auto install express --add-command "--legacy-peer-deps"
```

### `uninstall`

Uninstall packages from configured package managers.

```bash
pm-auto uninstall [options] <packages...>
```

**Options:**

- `-A, --add-command <command>` - Add a custom command to all uninstallation commands from config file
- `-h, --help` - Display help

**Examples:**

```bash
# Uninstall single package
pm-auto uninstall lodash

# Uninstall multiple packages
pm-auto uninstall lodash express axios

# Add custom flag to uninstallation
pm-auto uninstall lodash --add-command "--force"
```

### `config`

Set the path to your configuration file.

```bash
pm-auto config <path>
```

**Options:**

- `-h, --help` - Display help

**Examples:**

```bash
# Set config file path
pm-auto config ./pm-auto.config.json

# Use absolute path
pm-auto config /home/user/project/pm-auto.config.json
```

## Configuration

pm-auto uses a configuration file to define project presets with specific package managers and packages.

### Configuration File Structure

Create a JSON file (e.g., `config.json`) with the following format:

```json
{
  "vite": {
    "name": "vite",
    "packageManager": "npm",
    "packages": [
      {
        "command": "@types/three --save-dev",
        "interactive": false
      },
      {
        "command": "@react-three/fiber",
        "interactive": false
      },
      {
        "command": "gsap",
        "interactive": false
      },
      {
        "command": "create-vite@latest my-app",
        "interactive": true
      }
    ]
  },
  "express-api": {
    "name": "express-api",
    "packageManager": "pnpm",
    "packages": [
      {
        "command": "express",
        "interactive": false
      },
      {
        "command": "dotenv",
        "interactive": false
      }
    ]
  }
}
```

### Configuration Properties

- **`name`** - Identifier for the project preset
- **`packageManager`** - Package manager to use (`npm`, `yarn`, or `pnpm`)
- **`packages`** - Array of package installation configurations
  - **`command`** - The package name and any additional flags (e.g., `lodash`, `typescript --save-dev`)
  - **`interactive`** - Set to `true` for commands that require user interaction (e.g., `create-vite@latest`)

### Setting Up Your Config

1. Create your config file in any directory
2. Set the path using relative paths from your current working directory:

```bash
# From C:\Users\admin\Documents
C:\Users\admin\Documents> pm-auto config ./test.json

# From a project directory
/home/user/projects/my-app> pm-auto config ../configs/pm-auto-config.json
```

3. Verify the configuration is set correctly by running a dry run:

```bash
pm-auto install --dry-run
```

> **📝 Note:** The config path is stored persistently. If you move the config file, remember to update the path using `pm-auto config <new-path>` again.

## Global Options

- `-V, --version` - Output the version number
- `-h, --help` - Display help for command

## Use Cases

### Multi-Project Development

When working on projects that use different package managers, pm-auto ensures packages are installed consistently across all of them.

### Package Testing

Test your package installation across multiple package managers to ensure compatibility.

## Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/pm-auto.git
   cd pm-auto
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```

### Development Workflow

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add tests if applicable

3. **Test your changes:**
   ```bash
   npm test
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   **Commit message format:**
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** from your fork to the main repository

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused on a single feature or fix

### Reporting Issues

Found a bug or have a feature request?

1. Check if the issue already exists
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person

Thank you for contributing to pm-auto! 🎉
