# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

HackerTyper2.0 ("CYBER NEXUS") is a fake hacker-OS prank/entertainment simulator. Everything it displays is simulated — there is no real networking, hacking, mining, or file access. It is a **zero-dependency vanilla web app**: three files (`index.html`, `script.js`, `styles.css`), no build step, no package manager, no tests. The UI/docs are largely in Hebrew (RTL-aware), code and identifiers are in English.

## Running & deploying

- **Run locally:** open `index.html` directly in a browser, or serve the folder (e.g. `python -m http.server`). No build/install.
- **Deploy:** `.github/workflows/deploy.yml` triggers on push to the `test` branch and publishes the repo root into a `test/` subfolder on the `main` branch via GitHub Pages. Production hosting is GitHub Pages from `main`.

## Architecture (all in `script.js`, ~3000 lines)

Loaded as a single classic `<script>` (no modules). Bottom of the file instantiates `const OS = new CyberNexusOS()`, which boots everything. Key pieces, in dependency order:

- **`CONFIG`** (top of file) — all static data: boot log lines, TyperScene code samples per language, default `settings` (hardware specs, etc.). Edit here to change copy/specs.
- **`APPS`** (large object, ~line 1045) — **the central registry**. Each key (`typerscene`, `network`, `radar`, `monitor`, `matrix`, `globe`, `terminal`, `firewall`, `downloader`/EXFIL, `malware`/PAYLOAD, `miner`, `cracker`, `cctv`, `wiretap`, `satuplink`, `dnssniffer`, `darkweb`, `settings`) maps to `{ title, render(container) }`. `render` builds the window's DOM and returns/sets `container.cleanup` to tear down intervals when the window closes. **To add an app:** add an entry here, add a matching `<button class="app-icon" data-app="...">` in `index.html`'s taskbar, and (optionally) a `baseUsage` row in `SystemState`.
- **`WindowManager`** — `create(appName, appConfig)` builds a draggable window, calls `appConfig.render`, tracks open windows in `this.windows` (Map keyed by appName) and `this.activeWindow`. Clicking a taskbar icon toggles the window open/closed.
- **`SystemState`** — global simulated resource model (`cpu/ram/gpu/network/diskio/bandwidth`). `baseUsage` is per-app idle cost; apps call `setBoost(appName, {resource:[min,max]})` / `clearBoost(appName)` (typically in render/cleanup) to spike the SYSTEM monitor while active. `throttle` and `getSpeedMultiplier` let apps slow their own intervals; `getHardwareSpecs()` pulls from `CONFIG.settings`.
- **`ShortcutManager`** (~line 475) — the **secret keyboard shortcuts** engine. `register(key, count, windowMs, callback)` fires `callback` when `key` is pressed `count` times within `windowMs`. Timing derives from `const MS_PER_PRESS = 500` and helper `w(count) = count * MS_PER_PRESS` — **change `MS_PER_PRESS` to tune all shortcut speeds at once.** Letter keys are matched via `e.code` ("KeyZ"→"z") so they work regardless of keyboard layout/language. Registered effects include Ctrl×3 (ACCESS DENIED), Shift×3 (ACCEPTED), Alt×3 (self-destruct), Z×3 (encrypt), Q×3 (trace), CapsLock×3 (admin), X×4 (FBI), Space×5 (satellite). `showSecretOverlay(className, html, duration)` renders the fullscreen effect.
- **`TouchShortcutManager`** — mobile equivalent (tap sequences) for devices without a keyboard.
- **`TutorialManager`** — first-visit slideshow. Gated on `localStorage['nexus_tutorial_seen']`; delete that key to make it show again.
- **`TyperScene`** — the TYPER app: simulates live code typing from `CONFIG.typerscene.examples`, with `SyntaxHighlighter`.
- **`BootSequence`** — animated boot screen using `CONFIG.boot.logs`, awaited before the desktop initializes.
- **`CyberNexusOS`** — top-level orchestrator: runs boot, loads saved settings from `localStorage['nexus_settings']`, then `setupTaskbar` / `setupCursor` / `setupClock` / `setupKeyboardShortcuts`.

### Built-in (non-secret) keyboard shortcuts
Wired in `CyberNexusOS.setupKeyboardShortcuts`: `Alt+1..9` open apps by their order in `Object.keys(APPS)`, `Escape` closes the active window (suppressed while the tutorial is open), `Ctrl+Shift+Alt` opens SETTINGS.

## Conventions

- **Styling:** all colors are CSS variables at the top of `styles.css` (`--primary` green `#0f0`, `--accent` cyan, `--danger` red, `--warning` yellow). Theme by editing these.
- **DOM construction** is done in JS via `Utils.createElement` and `innerHTML` inside each app's `render`. There is no framework/templating.
- **Cleanup matters:** apps create `setInterval`/`requestAnimationFrame` loops. Always store teardown on `container.cleanup` so `WindowManager.close` can stop them — leaking intervals degrades performance.
- **Analytics:** Firebase/GA4 (`measurementId: G-KQ901LJ4J1`) exists but is currently **commented out** in `index.html`. When enabled it exposes `window._analytics` / `window._logEvent` for custom `logEvent` calls.
