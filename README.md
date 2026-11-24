# Firefly Meadow

A cozy Claude Code mod: an animated backdrop of fireflies drifting over a dusky meadow, with the app's colors themed to match (deep indigo surfaces, warm cream text, firefly-gold accent).

The meadow starts quiet, with about 8 fireflies. As your context window fills, more arrive, up to about 72 at a full window, so you can feel at a glance how much room is left. After a compaction the swarm thins out again.

The backdrop draws in the Claude desktop and mobile apps. Terminals and editors don't draw backdrops. With reduced motion turned on, the scene shows still.

## Install

At the prompt of a terminal session:

```
/plugin install firefly-meadow --marketplace AGSilver51/firefly-meadow
```

Answer `y` to add the marketplace, then press Enter to pick the user scope.

From a shell:

```bash
claude plugin install firefly-meadow --marketplace AGSilver51/firefly-meadow
```

### Desktop app users

The desktop app's Plugins menu doesn't add marketplaces from GitHub, and `/plugin` doesn't run there. Use the shell command above instead. It needs the Claude Code command-line tool, which the desktop app doesn't include. If `claude` isn't found, install it:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

If the installer says `~/.local/bin` is not in your PATH, run the line it prints, then the install command above. Start a new session in the desktop app's Code tab and the meadow appears.

## License

MIT
