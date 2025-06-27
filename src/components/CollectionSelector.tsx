import { h } from "preact"
import { VariableCollection } from "../types"
import { CollectionItem } from "./CollectionItem"

interface CollectionSelectorProps {
  collections: VariableCollection[]
  selectedCollections: string[]
  onCollectionToggle: (collectionId: string) => void
  onLoadVariables: () => void
}

export function CollectionSelector({ 
  collections, 
  selectedCollections, 
  onCollectionToggle, 
  onLoadVariables 
}: CollectionSelectorProps) {
  return (
    <div class="section">
      <h2>Select Collections</h2>
      <div class="info">
        Choose which variable collections to use for generating color swatches:
      </div>
      <div class="collection-list">
        {collections.length === 0 ? (
          <div class="empty-state">
            No variable collections found in this file
          </div>
        ) : (
          collections.map((collection) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              isSelected={selectedCollections.includes(collection.id)}
              onToggle={() => onCollectionToggle(collection.id)}
            />
          ))
        )}
      </div>
      <button
        class="button button-primary"
        onClick={onLoadVariables}
        disabled={selectedCollections.length === 0}
      >
        Load Selected Collections
      </button>
    </div>
  )
}