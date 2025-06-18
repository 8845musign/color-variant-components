let colorVariants: Array<{name: string, color: any, hex: string}> = [];

const scanButton = document.getElementById('scan-button') as HTMLButtonElement;
const createButton = document.getElementById('create-button') as HTMLButtonElement;
const rescanButton = document.getElementById('rescan-button') as HTMLButtonElement;
const cancelButton = document.getElementById('cancel-button') as HTMLButtonElement;
const resultsSection = document.getElementById('results-section') as HTMLDivElement;
const colorList = document.getElementById('color-list') as HTMLDivElement;

scanButton.addEventListener('click', () => {
  parent.postMessage({ pluginMessage: { type: 'scan-colors' } }, '*');
});

rescanButton.addEventListener('click', () => {
  resultsSection.style.display = 'none';
  parent.postMessage({ pluginMessage: { type: 'scan-colors' } }, '*');
});

createButton.addEventListener('click', () => {
  if (colorVariants.length > 0) {
    parent.postMessage({ 
      pluginMessage: { 
        type: 'create-components',
        colorVariants: colorVariants
      } 
    }, '*');
  }
});

cancelButton.addEventListener('click', () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
});

window.onmessage = (event) => {
  const msg = event.data.pluginMessage;
  
  if (msg.type === 'color-variants') {
    colorVariants = msg.data;
    displayColorVariants();
  }
};

function displayColorVariants() {
  resultsSection.style.display = 'block';
  
  if (colorVariants.length === 0) {
    colorList.innerHTML = '<div class="empty-state">No colors found in selection</div>';
    createButton.disabled = true;
    return;
  }
  
  createButton.disabled = false;
  colorList.innerHTML = '';
  
  colorVariants.forEach((variant) => {
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';
    
    const colorSwatch = document.createElement('div');
    colorSwatch.className = 'color-swatch';
    colorSwatch.style.backgroundColor = variant.hex;
    
    const colorInfo = document.createElement('div');
    colorInfo.className = 'color-info';
    
    const colorName = document.createElement('div');
    colorName.className = 'color-name';
    colorName.textContent = variant.name;
    
    const colorHex = document.createElement('div');
    colorHex.className = 'color-hex';
    colorHex.textContent = variant.hex;
    
    colorInfo.appendChild(colorName);
    colorInfo.appendChild(colorHex);
    
    colorItem.appendChild(colorSwatch);
    colorItem.appendChild(colorInfo);
    
    colorList.appendChild(colorItem);
  });
}