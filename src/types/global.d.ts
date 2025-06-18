// Global type definitions for the Figma plugin

// Extend Window interface for UI-side global functions
interface Window {
  // Plugin message handler
  onmessage: ((event: MessageEvent) => void) | null;
}

// HTML variable for the plugin UI
declare const __html__: string;

// Plugin message types
interface PluginMessage {
  type: string;
  [key: string]: any;
}