figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'scan-colors') {
    const colorVariants = await scanColorVariants();
    figma.ui.postMessage({
      type: 'color-variants',
      data: colorVariants
    });
  }

  if (msg.type === 'create-components') {
    const { colorVariants } = msg;
    await createColorVariantComponents(colorVariants);
    figma.notify('Components created successfully!');
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

async function scanColorVariants(): Promise<Array<{name: string, color: RGB, hex: string}>> {
  const colorVariants: Array<{name: string, color: RGB, hex: string}> = [];
  const processedColors = new Set<string>();

  function rgbToHex(rgb: RGB): string {
    const toHex = (val: number) => {
      const hex = Math.round(val * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  function processNode(node: SceneNode) {
    if ('fills' in node && Array.isArray(node.fills)) {
      for (const fill of node.fills) {
        if (fill.type === 'SOLID' && fill.visible !== false) {
          const hex = rgbToHex(fill.color);
          if (!processedColors.has(hex)) {
            processedColors.add(hex);
            colorVariants.push({
              name: node.name || `Color ${colorVariants.length + 1}`,
              color: fill.color,
              hex: hex
            });
          }
        }
      }
    }

    if ('children' in node) {
      for (const child of node.children) {
        processNode(child);
      }
    }
  }

  for (const node of figma.currentPage.selection) {
    processNode(node);
  }

  if (figma.currentPage.selection.length === 0) {
    figma.notify('Please select objects to scan for color variants');
  }

  return colorVariants;
}

async function createColorVariantComponents(colorVariants: Array<{name: string, color: RGB, hex: string}>) {
  const componentSet = figma.createComponentSet();
  componentSet.name = "Color Variants";
  
  for (let i = 0; i < colorVariants.length; i++) {
    const variant = colorVariants[i];
    
    const component = figma.createComponent();
    const rect = figma.createRectangle();
    rect.resize(100, 100);
    rect.fills = [{
      type: 'SOLID',
      color: variant.color
    }];
    
    component.appendChild(rect);
    component.name = variant.name;
    
    componentSet.appendChild(component);
    
    const variantProps: { [key: string]: string } = {
      Color: variant.name
    };
    componentSet.addComponentProperty('Color', 'VARIANT', variant.name);
    component.setProperties(variantProps);
  }
  
  const currentX = figma.viewport.center.x;
  const currentY = figma.viewport.center.y;
  componentSet.x = currentX - componentSet.width / 2;
  componentSet.y = currentY - componentSet.height / 2;
  
  figma.currentPage.selection = [componentSet];
  figma.viewport.scrollAndZoomIntoView([componentSet]);
}