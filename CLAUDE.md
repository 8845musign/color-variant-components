# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma plugin that creates component sets with color variants using Figma's color variables system. It allows users to select color collections and generate components with all color variants from those collections.

## Common Development Tasks

### Project Setup
```bash
npm install
```

### Build Commands
- **Production build**: `npm run build`
- **Development watch mode**: `npm run watch`
- **Type checking**: `npm run type-check`

### Testing Commands
- **Run tests**: `npm test`
- **Run tests with UI**: `npm run test:ui`
- **Run tests with coverage**: `npm run test:coverage`

### Testing the Plugin
1. Run `npm run build` to compile the plugin
2. In Figma desktop app: Menu → Plugins → Development → Import plugin from manifest...
3. Select the `manifest.json` file from the project root

## Architecture Notes

### Project Structure
```
├── src/
│   ├── main.ts           # Main plugin code (runs in Figma's sandbox)
│   ├── ui.tsx            # UI React/Preact component (runs in iframe)
│   ├── services/         # Service layer for business logic
│   │   ├── ColorService.ts          # Handles color variable operations
│   │   ├── ComponentService.ts      # Creates and manages components
│   │   ├── MessageService.ts        # Handles UI-plugin communication
│   │   └── SelectionService.ts      # Manages node selection
│   ├── components/       # React/Preact UI components
│   │   ├── App.tsx                  # Main app component
│   │   ├── CollectionSelector.tsx   # Color collection selection
│   │   └── ColorGrid.tsx            # Color preview grid
│   ├── utils/            # Utility functions
│   │   ├── colors.ts               # Color manipulation utilities
│   │   ├── components.ts           # Component creation helpers
│   │   └── figma.ts                # Figma API helpers
│   ├── types/            # TypeScript type definitions
│   └── test/             # Test files for all modules
├── build/                # Build output (gitignored)
├── manifest.json         # Figma plugin manifest
└── build-figma-plugin.main.js  # Build configuration
```

### Key Components

1. **Plugin Code (`src/main.ts`)**:
   - Initializes the plugin and UI
   - Orchestrates services for handling user actions
   - Manages communication with Figma API

2. **UI Code (`src/ui.tsx`)**:
   - React/Preact-based user interface
   - Displays color collections and variables
   - Handles user selection and component generation

3. **Service Layer**:
   - **ColorService**: Retrieves and manages Figma color variables
   - **ComponentService**: Creates component sets with color variants
   - **MessageService**: Handles bidirectional communication
   - **SelectionService**: Validates and manages node selection

4. **Testing Infrastructure**:
   - Comprehensive test suite using Vitest
   - Mock implementations for Figma API
   - Test coverage for all services and utilities

### Development Guidelines

- The plugin uses TypeScript with strict type checking
- Built using @create-figma-plugin build system
- UI uses Preact (React-compatible) for component-based architecture
- Service-oriented architecture for separation of concerns
- All new features should include corresponding tests
- Use the existing mock infrastructure in tests for Figma API calls
- Follow the established patterns for message passing between UI and plugin code

### Testing Best Practices

- Write tests for all new services and utilities
- Use the mock factories in `test/mocks/` for consistent test data
- Test both success and error scenarios
- Ensure proper cleanup in tests to avoid state leakage