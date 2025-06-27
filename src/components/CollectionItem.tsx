import { h } from "preact"
import { VariableCollection } from "../types"

interface CollectionItemProps {
  collection: VariableCollection
  isSelected: boolean
  onToggle: () => void
}

export function CollectionItem({ collection, isSelected, onToggle }: CollectionItemProps) {
  return (
    <div 
      class={`collection-item ${isSelected ? 'selected' : ''}`}
      onClick={onToggle}
    >
      <input 
        type="checkbox" 
        checked={isSelected}
        onChange={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        aria-label={`Select ${collection.name}`}
      />
      <div class="collection-info">
        <div class="collection-name">{collection.name}</div>
        <div class="collection-count">{collection.colorCount} colors</div>
      </div>
    </div>
  )
}