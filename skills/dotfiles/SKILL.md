---
name: dotfiles-management
description: Guidelines and rules for managing the user's dotfiles repository, config files, and installation scripts.
---

# Dotfiles Management Skill

Use this skill when modifying system configurations, shell profiles, editor settings, or the installer scripts within the dotfiles repository.

## Repository Location
The dotfiles repository is stored at:
`/Users/rodydavis/dev/git/dotfiles`

## Rules
- When updating or modifying configuration files (like `.zshrc`, `.gitconfig`, `.gitignore_global`, or Zed settings), always make changes inside the dotfiles repository rather than directly editing files in the home directory (`~`).
- After modifying configurations, run the `./install.sh` script to link/sync them.
- Always run the installer in dry-run mode (`./install.sh --dry-run` or `-d`) first to verify changes.

## Bootstrapping & Installation Guidelines

### 1. SSH & Git Clones
* When cloning private repositories in the background, check if the host is in `~/.ssh/known_hosts` first. Use `ssh-keyscan` to populate it before running `git clone` to prevent the task from being suspended on interactive host key prompts.

### 2. Homebrew Bundle & Tap Trust
* **Tap Trust:** Modern Homebrew requires explicit tap trust approval. When running `brew bundle` in unattended background scripts, prepend `HOMEBREW_NO_REQUIRE_TAP_TRUST=1` to bypass interactive prompts.
* **Sudo Casks:** Avoid including casks that require administrative (`sudo`) privileges (e.g. `basictex`) in unattended installations. Comment them out in the `Brewfile` and instruct the user to install them manually in their terminal.
* **Deprecated/Private Taps:** Keep the `Brewfile` clean of deprecated taps (like `homebrew/cask-fonts`) or private/unauthorized taps (like `robotsandpencils/made`) to avoid failing the entire bundle installation.

### 3. Node.js/NPM Runtime
* Installing `nvm` via Homebrew does not install a Node runtime. Before executing global NPM package installations, initialize `nvm` and run `nvm install --lts` to verify a node/npm binary is active.

### 4. Java & Android SDK Configuration
* Homebrew's `openjdk` is keg-only. To ensure Java is detected by Android CLI and Flutter tools, configure `.zshrc` to export `/opt/homebrew/opt/openjdk/bin` in the `PATH` and set `JAVA_HOME` to the Homebrew JDK path.
