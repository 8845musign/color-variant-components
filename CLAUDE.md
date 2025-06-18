# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma plugin that reads color variants from selected objects and creates component sets with those color variants applied as fills.

## Common Development Tasks

### Project Setup
```bash
npm install
```

### Build Commands
- **Production build**: `npm run build`
- **Development watch mode**: `npm run watch`
- **Type checking**: `npm run type-check`

### Testing the Plugin
1. Run `npm run build` to compile the plugin
2. In Figma desktop app: Menu → Plugins → Development → Import plugin from manifest...
3. Select the `manifest.json` file in the `dist` folder

## Architecture Notes

### Project Structure
```
├── src/
│   ├── code.ts    # Main plugin code (runs in Figma's sandbox)
│   ├── ui.ts      # UI JavaScript (runs in iframe)
│   └── ui.html    # Plugin UI HTML
├── dist/          # Build output (gitignored)
├── manifest.json  # Figma plugin manifest
└── webpack.config.js # Build configuration
```

### Key Components

1. **Plugin Code (`src/code.ts`)**:
   - Handles communication with Figma API
   - Scans selected nodes for color fills
   - Creates component sets with color variants
   - Uses the Figma Plugin API

2. **UI Code (`src/ui.ts` & `src/ui.html`)**:
   - Provides user interface for the plugin
   - Displays found colors with visual swatches
   - Handles user interactions
   - Communicates with plugin code via postMessage

### Development Guidelines

- The plugin uses TypeScript for type safety with Figma's API
- Webpack bundles the code for both the plugin and UI
- The UI runs in an iframe and communicates with the plugin via message passing
- Always test color extraction with various node types (frames, shapes, text, etc.)
- Ensure unique colors are properly deduplicated when scanning