# Color Variant Components

A Figma plugin that scans selected objects for color variants and creates a component set with those color variations.

## Features

- **Color Scanning**: Extracts unique colors from selected objects in your design
- **Component Creation**: Automatically creates a component set with variants for each color
- **Visual Preview**: Shows all found colors with swatches and hex values before creation

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Figma desktop app

### Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Commands

- **Build for production**: `npm run build`
- **Watch mode**: `npm run watch`
- **Type checking**: `npm run type-check`

### Loading the Plugin in Figma

1. Build the plugin: `npm run build`
2. Open Figma desktop app
3. Go to Menu → Plugins → Development → Import plugin from manifest...
4. Select the `manifest.json` file in the `dist` folder

## Usage

1. Select objects in your Figma design that contain the colors you want to use
2. Run the plugin (Plugins → Development → Color Variant Components)
3. Click "Scan Selected Objects for Colors" to extract colors
4. Review the found colors in the list
5. Click "Create Component Set" to generate a component set with color variants

The plugin will create a component set centered in your viewport with each color as a variant.

## Project Structure

```
├── src/
│   ├── code.ts    # Main plugin logic
│   ├── ui.ts      # UI script
│   └── ui.html    # UI markup
├── manifest.json  # Figma plugin manifest
├── package.json   # Node dependencies
├── tsconfig.json  # TypeScript config
└── webpack.config.js # Build configuration
```