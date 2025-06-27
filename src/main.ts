import { showUI, on } from "@create-figma-plugin/utilities"
import { VariableService } from "./services/variable-service"
import { ComponentService } from "./services/component-service"
import { ColorVariable } from "./types"
import { emit } from "@create-figma-plugin/utilities"

export default function () {
  const variableService = new VariableService()
  const componentService = new ComponentService()
  
  showUI({ width: 400, height: 500 })

  // Handle messages from UI
  on("get-collections", async () => {
    try {
      const collections = await variableService.getCollections()
      emit("variable-collections", collections)
    } catch (error) {
      console.error('Error getting collections:', error)
      figma.notify('Error loading variable collections')
    }
  })

  on("get-color-variables", async (selectedCollectionIds: string[]) => {
    try {
      const colorVariables = await variableService.getColorVariables(selectedCollectionIds)
      emit("color-variables", colorVariables)
    } catch (error) {
      console.error('Error getting color variables:', error)
      figma.notify('Error loading color variables')
    }
  })

  on("create-components", async (colorVariables: ColorVariable[]) => {
    try {
      await componentService.createColorComponents(colorVariables)
    } catch (error) {
      console.error('Error creating components:', error)
      figma.notify('Error creating components')
    }
  })

  on("cancel", () => {
    figma.closePlugin()
  })
}