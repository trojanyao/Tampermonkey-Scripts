# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A collection of standalone Tampermonkey userscripts, one directory per target site (`Douban/`, `Unsplash/`, `Weibo/`). There is no build system, package manager, linter, or test suite — each `.js` file is a self-contained userscript that runs directly in the browser. Code comments and UI text are mostly in Chinese.

## Script structure

- Every script starts with a `// ==UserScript==` metadata block (`@name`, `@version`, `@match`/`@include`, `@grant`, `@require`). Changes to target URLs, external libraries, or permissions go here, not in code.
- Scripts use `@grant none` and plain DOM APIs, wrapped in an IIFE, triggered on `window` `load` (sometimes with a `setTimeout` to wait for SPA-rendered content).
- All scripts work by DOM scraping with structural CSS selectors (e.g. Unsplash's `header+div > div > ...`, Weibo's `woo-*` classes). Most bug fixes in git history are "the site changed its DOM" — when fixing, re-derive selectors from the live page rather than assuming the existing ones are correct.
- Unsplash script depends on moment.js via `@require` from cdnjs, and rewrites the download link to a Blob URL so the `download` attribute (filename) is honored cross-origin.

## Publishing

- The Unsplash script is published on Greasy Fork (script id 441752); its `@downloadURL`/`@updateURL` point there. Bump `@version` when changing it, otherwise users won't receive the update (see commits like `build(Unsplash): update version`).
- README.md documents published scripts with their install link.

## Local debugging

`debug.user.js` is a stub userscript that loads a local file via `@require file:///...`. To debug, install it in Tampermonkey, point `@require` at the script being worked on (absolute path on the user's machine), and enable "Allow access to file URLs" for the extension. The path in the committed file is machine-specific.

## Conventions

- Commit messages follow Conventional Commits with a site scope, e.g. `fix(Unsplash): ...`, `feat(微博): ...`.
- File naming is inconsistent (`*.user.js` vs `*_user.js`); Tampermonkey only auto-detects installs from URLs ending in `.user.js`.
