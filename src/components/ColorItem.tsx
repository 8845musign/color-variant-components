import { h } from "preact"
import { ColorVariable } from "../types"

interface ColorItemProps {
  variable: ColorVariable
}

export function ColorItem({ variable }: ColorItemProps) {
  return (
    <div class="color-item">
      <div
        class="color-swatch"
        style={{ backgroundColor: variable.hex }}
        aria-label={`Color swatch for ${variable.name}`}
      />
      <div class="color-info">
        <div class="color-name">{variable.name}</div>
        <div class="color-hex">{variable.hex}</div>
      </div>
    </div>
  )
}