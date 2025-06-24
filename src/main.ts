import { showUI, on, emit } from "@create-figma-plugin/utilities";

export default function () {
  showUI({ width: 400, height: 500 });

  on("get-collections", async () => {
    console.log('Getting variable collections...');
    const collections = await getVariableCollections();
    console.log('Sending collections to UI:', collections);
    emit("variable-collections", collections);
  });

  on("get-color-variables", async (selectedCollectionIds: string[]) => {
    console.log('Getting color variables for collections:', selectedCollectionIds);
    const colorVariables = await getLocalColorVariables(selectedCollectionIds);
    console.log('Sending variables to UI:', colorVariables);
    emit("color-variables", colorVariables);
  });

  on("create-components", async (colorVariables: Array<{id: string, name: string, color: RGB, hex: string}>) => {
    await createColorVariantComponents(colorVariables);
    figma.notify('Color swatch components created successfully!');
  });

  on("cancel", () => {
    figma.closePlugin();
  });
}

async function getVariableCollections(): Promise<Array<{id: string, name: string, colorCount: number}>> {
  const collections: Array<{id: string, name: string, colorCount: number}> = [];
  
  try {
    // Get all local variable collections
    const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
    
    console.log('Found collections:', localCollections.length);
    
    // Get all variables to count colors per collection
    const localVariables = await figma.variables.getLocalVariablesAsync();
    
    for (const collection of localCollections) {
      // Count color variables in this collection
      const colorCount = localVariables.filter(v => 
        v.variableCollectionId === collection.id && 
        v.resolvedType === 'COLOR'
      ).length;
      
      collections.push({
        id: collection.id,
        name: collection.name,
        colorCount: colorCount
      });
    }
    
    console.log('Collections with color counts:', collections);
    
  } catch (error) {
    console.error('Error getting collections:', error);
    figma.notify('Error loading variable collections: ' + String(error));
  }
  
  return collections;
}

// Helper function to resolve variable aliases recursively
async function resolveColorValue(value: any, depth = 0): Promise<RGB | null> {
  if (depth > 10) {
    console.log('  - Max alias depth reached, stopping recursion');
    return null;
  }
  
  // Direct RGB value
  if (value && typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
    return value as RGB;
  }
  
  // Variable alias
  if (value && typeof value === 'object' && 'type' in value && value.type === 'VARIABLE_ALIAS') {
    const aliasedVariable = await figma.variables.getVariableByIdAsync(value.id);
    if (aliasedVariable && aliasedVariable.resolvedType === 'COLOR') {
      const aliasedCollection = await figma.variables.getVariableCollectionByIdAsync(aliasedVariable.variableCollectionId);
      if (aliasedCollection) {
        // Try to resolve from the first mode of the aliased variable
        const aliasValue = aliasedVariable.valuesByMode[aliasedCollection.modes[0].modeId];
        return resolveColorValue(aliasValue, depth + 1);
      }
    }
  }
  
  return null;
}

async function getLocalColorVariables(selectedCollectionIds?: string[]): Promise<Array<{id: string, name: string, color: RGB, hex: string}>> {
  const colorVariables: Array<{id: string, name: string, color: RGB, hex: string}> = [];
  
  try {
    // Get all local variables
    const localVariables = await figma.variables.getLocalVariablesAsync();
    
    console.log('Total variables found:', localVariables.length);
    console.log('Selected collection IDs:', selectedCollectionIds);
    
    const rgbToHex = (rgb: RGB): string => {
      const toHex = (val: number) => {
        const hex = Math.round(val * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
    };
    
    // Filter for color variables
    let filteredCount = 0;
    let colorCount = 0;
    
    for (const variable of localVariables) {
      // Filter by selected collections if provided
      if (selectedCollectionIds && selectedCollectionIds.length > 0) {
        if (!selectedCollectionIds.includes(variable.variableCollectionId)) {
          continue;
        }
      }
      
      filteredCount++;
      
      if (variable.resolvedType === 'COLOR') {
        colorCount++;
        console.log(`Processing color variable: ${variable.name} (${variable.id})`);
        
        // Get the collection to find the modes
        const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
        if (!collection) {
          console.log('  - Collection not found, skipping');
          continue;
        }
        
        console.log(`  - Collection: ${collection.name}, Modes: ${collection.modes.length}`);
        
        // Try all modes to find a valid color value
        let colorValue = null;
        for (const mode of collection.modes) {
          const value = variable.valuesByMode[mode.modeId];
          console.log(`  - Mode ${mode.name}: value type = ${typeof value}`, value);
          
          const resolvedColor = await resolveColorValue(value);
          if (resolvedColor) {
            colorValue = resolvedColor;
            console.log('  - Resolved to RGB color');
            break;
          }
        }
        
        if (colorValue) {
          colorVariables.push({
            id: variable.id,
            name: variable.name,
            color: colorValue,
            hex: rgbToHex(colorValue)
          });
          console.log(`  - Added to results: ${variable.name} (${rgbToHex(colorValue)})`);
        } else {
          console.log('  - No valid RGB color value found in any mode');
        }
      }
    }
    
    console.log(`Summary: ${filteredCount} variables in selected collections, ${colorCount} are colors, ${colorVariables.length} have valid RGB values`);
    
    console.log('Found color variables:', colorVariables.length);
    
    if (colorVariables.length === 0) {
      figma.notify('No color variables found in this file');
    }
    
  } catch (error) {
    console.error('Error getting variables:', error);
    figma.notify('Error loading color variables: ' + String(error));
  }
  
  return colorVariables;
}

async function createColorVariantComponents(colorVariables: Array<{id: string, name: string, color: RGB, hex: string}>) {
  console.log('Creating components for variables:', colorVariables);
  
  // Create individual components first
  const components: ComponentNode[] = [];
  
  for (let i = 0; i < colorVariables.length; i++) {
    const variable = colorVariables[i];
    console.log(`Creating component for ${variable.name}:`, variable.color, variable.hex);
    
    const component = figma.createComponent();
    const rect = figma.createRectangle();
    rect.resize(100, 100);
    
    // Check if RGB values need normalization (0-255 to 0-1)
    let r = variable.color.r;
    let g = variable.color.g;
    let b = variable.color.b;
    
    // If any value is greater than 1, assume they're in 0-255 range
    if (r > 1 || g > 1 || b > 1) {
      console.log('Normalizing RGB values from 0-255 to 0-1 range');
      r = r / 255;
      g = g / 255;
      b = b / 255;
    }
    
    console.log(`RGB values: r=${r}, g=${g}, b=${b}`);
    
    // Apply the fill
    const fill: SolidPaint = {
      type: 'SOLID',
      color: { r, g, b },
      opacity: 1
    };
    
    rect.fills = [fill];
    
    component.appendChild(rect);
    component.name = `color/${variable.name}`;
    
    // Position components in a grid
    const cols = 5;
    component.x = (i % cols) * 120;
    component.y = Math.floor(i / cols) * 120;
    
    components.push(component);
  }
  
  console.log(`Created ${components.length} components`);
  
  // Select all components and center in viewport
  if (components.length > 0) {
    const bounds = {
      x: Math.min(...components.map(c => c.x)),
      y: Math.min(...components.map(c => c.y)),
      width: Math.max(...components.map(c => c.x + c.width)) - Math.min(...components.map(c => c.x)),
      height: Math.max(...components.map(c => c.y + c.height)) - Math.min(...components.map(c => c.y))
    };
    
    const centerX = figma.viewport.center.x - bounds.width / 2;
    const centerY = figma.viewport.center.y - bounds.height / 2;
    
    // Move all components to center
    components.forEach(component => {
      component.x = component.x - bounds.x + centerX;
      component.y = component.y - bounds.y + centerY;
    });
    
    figma.currentPage.selection = components;
    figma.viewport.scrollAndZoomIntoView(components);
    
    // Ask user if they want to combine as variants
    figma.notify('Components created! Select them and use "Combine as variants" if needed.');
  }
}