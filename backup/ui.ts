let colorVariables: Array<{id: string, name: string, color: any, hex: string}> = [];

// Note: In Figma plugins, console logs appear in:
// 1. Figma Desktop: Open Developer Tools (Cmd+Alt+I on Mac, Ctrl+Alt+I on Windows)
// 2. Look for the iframe with your plugin and check its console
console.log('UI script loaded');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded - initializing UI');
  const scanButton = document.getElementById('scan-button') as HTMLButtonElement;
  const createButton = document.getElementById('create-button') as HTMLButtonElement;
  const rescanButton = document.getElementById('rescan-button') as HTMLButtonElement;
  const cancelButton = document.getElementById('cancel-button') as HTMLButtonElement;
  const resultsSection = document.getElementById('results-section') as HTMLDivElement;
  const colorList = document.getElementById('color-list') as HTMLDivElement;

  if (!scanButton) {
    console.error('Scan button not found!');
    return;
  }

  scanButton.addEventListener('click', () => {
    console.log('Load button clicked');
    parent.postMessage({ pluginMessage: { type: 'get-color-variables' } }, '*');
  });

  rescanButton.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    parent.postMessage({ pluginMessage: { type: 'get-color-variables' } }, '*');
  });

  createButton.addEventListener('click', () => {
    if (colorVariables.length > 0) {
      parent.postMessage({ 
        pluginMessage: { 
          type: 'create-components',
          colorVariables: colorVariables
        } 
      }, '*');
    }
  });

  cancelButton.addEventListener('click', () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  });

  // Store references globally for the display function
  (window as any).resultsSection = resultsSection;
  (window as any).colorList = colorList;
  (window as any).createButton = createButton;
  
  // Show UI loaded indicator
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.classList.add('show');
    setTimeout(() => {
      statusEl.classList.remove('show');
    }, 2000);
  }
});

window.onmessage = (event) => {
  const msg = event.data.pluginMessage;
  
  if (msg.type === 'color-variables') {
    colorVariables = msg.data;
    displayColorVariables();
  }
};

function displayColorVariables() {
  const resultsSection = (window as any).resultsSection;
  const colorList = (window as any).colorList;
  const createButton = (window as any).createButton;
  
  if (!resultsSection || !colorList || !createButton) {
    console.error('UI elements not found');
    return;
  }
  
  resultsSection.style.display = 'block';
  
  if (colorVariables.length === 0) {
    colorList.innerHTML = '<div class="empty-state">No color variables found in this file</div>';
    createButton.disabled = true;
    return;
  }
  
  createButton.disabled = false;
  colorList.innerHTML = '';
  
  colorVariables.forEach((variable) => {
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';
    
    const colorSwatch = document.createElement('div');
    colorSwatch.className = 'color-swatch';
    colorSwatch.style.backgroundColor = variable.hex;
    
    const colorInfo = document.createElement('div');
    colorInfo.className = 'color-info';
    
    const colorName = document.createElement('div');
    colorName.className = 'color-name';
    colorName.textContent = variable.name;
    
    const colorHex = document.createElement('div');
    colorHex.className = 'color-hex';
    colorHex.textContent = variable.hex;
    
    colorInfo.appendChild(colorName);
    colorInfo.appendChild(colorHex);
    
    colorItem.appendChild(colorSwatch);
    colorItem.appendChild(colorInfo);
    
    colorList.appendChild(colorItem);
  });
}