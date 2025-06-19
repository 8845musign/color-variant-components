figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = async (msg) => {
  console.log('Received message:', msg.type);
  
  if (msg.type === 'get-color-variables') {
    console.log('Getting color variables...');
    const colorVariables = await getLocalColorVariables();
    console.log('Sending variables to UI:', colorVariables);
    figma.ui.postMessage({
      type: 'color-variables',
      data: colorVariables
    });
  }

  if (msg.type === 'create-components') {
    const { colorVariables } = msg;
    await createColorVariantComponents(colorVariables);
    figma.notify('Color swatch components created successfully!');
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

async function getLocalColorVariables(): Promise<Array<{id: string, name: string, color: RGB, hex: string}>> {
  const colorVariables: Array<{id: string, name: string, color: RGB, hex: string}> = [];
  
  try {
    // Get all local variables
    const localVariables = await figma.variables.getLocalVariablesAsync();
    
    console.log('Found variables:', localVariables.length);
    
    function rgbToHex(rgb: RGB): string {
      const toHex = (val: number) => {
        const hex = Math.round(val * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
    }
    
    // Filter for color variables
    for (const variable of localVariables) {
      console.log('Variable:', variable.name, 'Type:', variable.resolvedType);
      
      if (variable.resolvedType === 'COLOR') {
        // Get the collection to find the modes
        const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
        if (!collection) continue;
        
        // Get the default mode
        const defaultMode = collection.modes[0];
        const value = variable.valuesByMode[defaultMode.modeId];
        
        console.log('Color value:', value);
        
        if (value && typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
          colorVariables.push({
            id: variable.id,
            name: variable.name,
            color: value as RGB,
            hex: rgbToHex(value as RGB)
          });
        }
      }
    }
    
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
  // Create individual components first
  const components: ComponentNode[] = [];
  
  for (let i = 0; i < colorVariables.length; i++) {
    const variable = colorVariables[i];
    
    const component = figma.createComponent();
    const rect = figma.createRectangle();
    rect.resize(100, 100);
    rect.fills = [{
      type: 'SOLID',
      color: variable.color
    }];
    
    component.appendChild(rect);
    component.name = `Color Variant / Color=${variable.name}`;
    
    // Position components horizontally
    component.x = i * 120;
    component.y = 0;
    
    components.push(component);
  }
  
  // If we have components, combine them into a component set
  if (components.length > 0) {
    const componentSet = figma.combineAsVariants(components, figma.currentPage);
    componentSet.name = "Color Variants";
    
    // Center the component set in viewport
    const currentX = figma.viewport.center.x;
    const currentY = figma.viewport.center.y;
    componentSet.x = currentX - componentSet.width / 2;
    componentSet.y = currentY - componentSet.height / 2;
    
    figma.currentPage.selection = [componentSet];
    figma.viewport.scrollAndZoomIntoView([componentSet]);
  }
}