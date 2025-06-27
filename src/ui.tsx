import { h } from "preact"
import { render } from "preact"
import { useEffect, useState } from "preact/hooks"
import { emit, on } from "@create-figma-plugin/utilities"
import { ColorVariable, VariableCollection } from "./types"
import { CollectionSelector } from "./components/CollectionSelector"
import { ColorList } from "./components/ColorList"
import { StatusIndicator } from "./components/StatusIndicator"

import "!./ui.css"

function Plugin() {
  const [collections, setCollections] = useState<VariableCollection[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [showCollectionSelection, setShowCollectionSelection] = useState(false)
  const [colorVariables, setColorVariables] = useState<ColorVariable[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showStatus, setShowStatus] = useState(true)

  useEffect(() => {
    // Show UI loaded indicator briefly
    const timer = setTimeout(() => {
      setShowStatus(false)
    }, 2000)

    // Listen for collections from main
    const unsubscribeCollections = on(
      "variable-collections", 
      (data: VariableCollection[]) => {
        setCollections(data)
        setShowCollectionSelection(true)
      }
    )

    // Listen for color variables from main
    const unsubscribeVariables = on(
      "color-variables", 
      (data: ColorVariable[]) => {
        setColorVariables(data)
        setShowResults(true)
        setShowCollectionSelection(false)
      }
    )

    return () => {
      clearTimeout(timer)
      unsubscribeCollections()
      unsubscribeVariables()
    }
  }, [])

  const handleScanClick = () => {
    emit("get-collections")
  }

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const handleLoadVariables = () => {
    if (selectedCollections.length > 0) {
      emit("get-color-variables", selectedCollections)
    }
  }

  const handleRescanClick = () => {
    setShowResults(false)
    setShowCollectionSelection(false)
    setSelectedCollections([])
    emit("get-collections")
  }

  const handleCreateClick = () => {
    if (colorVariables.length > 0) {
      emit("create-components", colorVariables)
    }
  }

  const handleCancelClick = () => {
    emit("cancel")
  }

  return (
    <div>
      {!showCollectionSelection && !showResults && (
        <div class="section">
          <h2>Color Variant Components</h2>
          <div class="info">
            Create color swatch components from your local color variables. Each
            variable will become a variant in a component set.
          </div>
          <button
            class="button button-primary"
            onClick={handleScanClick}
          >
            Load Color Variables
          </button>
        </div>
      )}

      {showCollectionSelection && (
        <CollectionSelector
          collections={collections}
          selectedCollections={selectedCollections}
          onCollectionToggle={handleCollectionToggle}
          onLoadVariables={handleLoadVariables}
        />
      )}

      {showResults && (
        <div class="section">
          <h2>Color Variables</h2>
          <ColorList colorVariables={colorVariables} />
          <button
            class="button button-primary"
            onClick={handleCreateClick}
            disabled={colorVariables.length === 0}
          >
            Create Color Swatches
          </button>
          <button
            class="button button-secondary"
            onClick={handleRescanClick}
          >
            Refresh Variables
          </button>
        </div>
      )}

      <button
        class="button button-secondary"
        onClick={handleCancelClick}
      >
        Cancel
      </button>

      <StatusIndicator show={showStatus} message="UI Loaded" />
    </div>
  )
}

render(<Plugin />, document.getElementById("create-figma-plugin")!)