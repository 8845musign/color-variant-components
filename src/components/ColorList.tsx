import { h } from "preact"
import { ColorVariable } from "../types"
import { ColorItem } from "./ColorItem"

interface ColorListProps {
  colorVariables: ColorVariable[]
}

export function ColorList({ colorVariables }: ColorListProps) {
  if (colorVariables.length === 0) {
    return (
      <div class="empty-state">
        No color variables found in this file
      </div>
    )
  }

  return (
    <div class="color-list">
      {colorVariables.map((variable) => (
        <ColorItem key={variable.id} variable={variable} />
      ))}
    </div>
  )
}