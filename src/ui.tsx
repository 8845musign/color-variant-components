import { h } from "preact";
import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { emit, on } from "@create-figma-plugin/utilities";

import "!./ui.css";

interface ColorVariable {
  id: string;
  name: string;
  color: any;
  hex: string;
}

function Plugin() {
  const [colorVariables, setColorVariables] = useState<ColorVariable[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    // Show UI loaded indicator briefly
    setTimeout(() => {
      setShowStatus(false);
    }, 2000);

    // Listen for color variables from main
    on("color-variables", (data: ColorVariable[]) => {
      setColorVariables(data);
      setShowResults(true);
    });
  }, []);

  const handleScanClick = () => {
    console.log("Load button clicked");
    emit("get-color-variables");
  };

  const handleRescanClick = () => {
    setShowResults(false);
    emit("get-color-variables");
  };

  const handleCreateClick = () => {
    if (colorVariables.length > 0) {
      emit("create-components", colorVariables);
    }
  };

  const handleCancelClick = () => {
    emit("cancel");
  };

  return (
    <div>
      <div class="section">
        <h2>Color Variant Components</h2>
        <div class="info">
          Create color swatch components from your local color variables. Each
          variable will become a variant in a component set.
        </div>
        <button
          id="scan-button"
          class="button button-primary"
          onClick={handleScanClick}
        >
          Load Color Variables
        </button>
      </div>

      {showResults && (
        <div id="results-section" class="section">
          <h2>Color Variables</h2>
          <div id="color-list" class="color-list">
            {colorVariables.length === 0 ? (
              <div class="empty-state">
                No color variables found in this file
              </div>
            ) : (
              colorVariables.map((variable) => (
                <div class="color-item" key={variable.id}>
                  <div
                    class="color-swatch"
                    style={{ backgroundColor: variable.hex }}
                  />
                  <div class="color-info">
                    <div class="color-name">{variable.name}</div>
                    <div class="color-hex">{variable.hex}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            id="create-button"
            class="button button-primary"
            onClick={handleCreateClick}
            disabled={colorVariables.length === 0}
          >
            Create Color Swatches
          </button>
          <button
            id="rescan-button"
            class="button button-secondary"
            onClick={handleRescanClick}
          >
            Refresh Variables
          </button>
        </div>
      )}

      <button
        id="cancel-button"
        class="button button-secondary"
        onClick={handleCancelClick}
      >
        Cancel
      </button>

      {showStatus && (
        <div id="status" class="status show">
          UI Loaded
        </div>
      )}
    </div>
  );
}

render(<Plugin />, document.getElementById("create-figma-plugin")!);