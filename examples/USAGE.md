# Color Variant Components - Usage Examples

This document provides examples and best practices for using the Color Variant Components plugin.

## Basic Usage

### Creating Variants from a Single Component

1. **Select a Component**
   - Create or select an existing component (e.g., a button)
   - The component should have at least one solid fill color

2. **Run the Plugin**
   - Go to Plugins → Development → Color Variant Components
   - The plugin will detect your selection

3. **Define Colors**
   - Use preset palettes or define custom colors
   - Each color needs a name (e.g., "Primary", "Secondary")

4. **Generate Variants**
   - Click "Create Color Variants"
   - The plugin will create a component set with color variants

### Adding Variants to Existing Component Sets

If you already have a component set with other properties (e.g., Size, State), the plugin will:
- Preserve existing variant properties
- Add "Color" as a new variant property
- Create combinations with existing variants

## Example Scenarios

### Button Component

**Before:**
```
Button (Component)
└── Rectangle (Fill: #0066FF)
└── Text
```

**After running with Primary Colors preset:**
```
Button Colors (Component Set)
├── Color=Default
├── Color=Primary
├── Color=Primary Light
├── Color=Primary Dark
└── Color=Primary Subtle
```

### Card Component with Multiple Fills

**Structure:**
```
Card (Component)
├── Background (Fill: #FFFFFF)
├── Header
│   └── Rectangle (Fill: #0066FF)
└── Content
    └── Text
```

The plugin will apply the color variant to all solid fills within the component hierarchy.

### Complex Component Set

**Existing Component Set:**
```
Button (Component Set)
├── Size=Small, State=Default
├── Size=Small, State=Hover
├── Size=Large, State=Default
└── Size=Large, State=Hover
```

**After adding color variants:**
```
Button (Component Set)
├── Size=Small, State=Default, Color=Primary
├── Size=Small, State=Default, Color=Secondary
├── Size=Small, State=Hover, Color=Primary
├── Size=Small, State=Hover, Color=Secondary
├── Size=Large, State=Default, Color=Primary
├── Size=Large, State=Default, Color=Secondary
├── Size=Large, State=Hover, Color=Primary
└── Size=Large, State=Hover, Color=Secondary
```

## Best Practices

### 1. Component Preparation
- Ensure your base component uses solid fills
- Gradients and images won't be affected
- Group related elements that should share the same color

### 2. Naming Conventions
- Use clear, descriptive color names
- Follow your design system's naming pattern
- Consider semantic names (Success, Error) vs descriptive (Green, Red)

### 3. Color Selection
- Start with a cohesive palette
- Test colors for accessibility
- Consider how colors work in light/dark themes

### 4. Performance
- For large component sets, work in batches
- The plugin processes all selected components at once
- Complex components with many children may take longer

## Preset Palettes

### Primary Colors
- Ideal for brand colors and main UI elements
- Includes light/dark variations
- Subtle variant for backgrounds

### Semantic Colors
- Success, Warning, Error, Info
- Perfect for status indicators
- Follows common UI patterns

### Grayscale
- 10 shades from Gray 50 to Gray 900
- Useful for text and neutral elements
- Based on common design systems

### Rainbow
- Full spectrum of colors
- Great for data visualization
- Fun and vibrant options

## Troubleshooting

### "Please select at least one component"
- Ensure you've selected a component or component set
- Frames and groups are not supported
- The selection must be on the current page

### Colors not applying correctly
- Check if the element has a solid fill
- Gradients, images, and effects are preserved but not modified
- Nested components maintain their own fills

### Plugin not showing updates
- Refresh the plugin (close and reopen)
- Check the console for any errors
- Ensure you're running the latest build

## Advanced Tips

### Batch Processing
Select multiple components to process them all at once:
- Each component becomes its own component set
- Same color variants applied to all

### Custom Color Workflows
1. Start with one preset
2. Modify colors as needed
3. Add or remove specific variants
4. Save your custom palette for reuse

### Integration with Design Systems
- Export component sets to your library
- Use consistent naming with your tokens
- Document color usage guidelines