import { ColorVariable } from '../types'

export class ComponentService {
  private readonly SWATCH_SIZE = 120
  private readonly PADDING = 20
  private readonly COLUMNS = 5

  async createColorComponents(colorVariables: ColorVariable[], prefix?: string): Promise<void> {
    if (colorVariables.length === 0) {
      figma.notify('No color variables selected')
      return
    }

    const components: ComponentNode[] = []
    
    for (const colorVar of colorVariables) {
      const component = await this.createSingleColorComponent(colorVar, prefix)
      if (component) {
        components.push(component)
      }
    }

    if (components.length > 0) {
      this.layoutComponents(components, prefix)
      figma.notify(`Created ${components.length} color variant components`)
    }
  }

  private async createSingleColorComponent(colorVar: ColorVariable, prefix?: string): Promise<ComponentNode | null> {
    try {
      const rect = figma.createRectangle()
      rect.resize(this.SWATCH_SIZE, this.SWATCH_SIZE)
      rect.name = colorVar.name
      
      // Apply the color
      rect.fills = [{
        type: 'SOLID',
        color: colorVar.color,
        opacity: 1,
        visible: true,
        blendMode: 'NORMAL'
      }]
      
      // Bind the variable to the fill
      try {
        const variable = await figma.variables.getVariableByIdAsync(colorVar.id)
        if (variable) {
          const fillsCopy = rect.fills.slice()
          if (fillsCopy[0].type === 'SOLID') {
            const paintedFills = figma.variables.setBoundVariableForPaint(
              fillsCopy[0],
              'color',
              variable
            )
            rect.fills = [paintedFills]
          }
        }
      } catch (error) {
        console.error(`Failed to bind variable ${colorVar.name}:`, error)
      }
      
      // Create component
      const component = figma.createComponent()
      component.name = prefix ? `${prefix}${colorVar.name}` : colorVar.name
      component.resize(this.SWATCH_SIZE, this.SWATCH_SIZE)
      component.appendChild(rect)
      
      return component
    } catch (error) {
      console.error(`Error creating component for ${colorVar.name}:`, error)
      return null
    }
  }

  private layoutComponents(components: ComponentNode[], prefix?: string): void {
    const group = figma.group(components, figma.currentPage)
    group.name = prefix ? `${prefix}Color Variant Components` : 'Color Variant Components'
    
    // Arrange in grid
    components.forEach((component, index) => {
      const row = Math.floor(index / this.COLUMNS)
      const col = index % this.COLUMNS
      
      component.x = col * (this.SWATCH_SIZE + this.PADDING)
      component.y = row * (this.SWATCH_SIZE + this.PADDING)
    })
    
    // Center in viewport
    const totalWidth = Math.min(components.length, this.COLUMNS) * (this.SWATCH_SIZE + this.PADDING) - this.PADDING
    const totalRows = Math.ceil(components.length / this.COLUMNS)
    const totalHeight = totalRows * (this.SWATCH_SIZE + this.PADDING) - this.PADDING
    
    group.x = figma.viewport.center.x - totalWidth / 2
    group.y = figma.viewport.center.y - totalHeight / 2
    
    figma.viewport.scrollAndZoomIntoView([group])
    figma.currentPage.selection = [group]
  }
}