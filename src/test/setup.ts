import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock figma global
(global as any).figma = {
  showUI: vi.fn(),
  closePlugin: vi.fn(),
  notify: vi.fn(),
  ui: {
    postMessage: vi.fn(),
    onmessage: null,
    on: vi.fn(),
    off: vi.fn(),
    once: vi.fn(),
    resize: vi.fn(),
    close: vi.fn(),
    show: vi.fn(),
    hide: vi.fn()
  },
  variables: {
    getLocalVariableCollectionsAsync: vi.fn(),
    getVariableByIdAsync: vi.fn()
  },
  createRectangle: vi.fn(),
  createComponent: vi.fn(),
  group: vi.fn(),
  viewport: {
    center: { x: 0, y: 0 },
    zoom: 1,
    scrollAndZoomIntoView: vi.fn()
  },
  currentPage: {
    selection: []
  }
} as any