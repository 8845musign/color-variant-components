import { describe, it, expect } from 'vitest'
import { rgbToHex, hexToRgb } from '../color-utils'

describe('color-utils', () => {
  describe('rgbToHex', () => {
    it('should convert RGB to hex correctly', () => {
      expect(rgbToHex({ r: 1, g: 0, b: 0 })).toBe('#ff0000')
      expect(rgbToHex({ r: 0, g: 1, b: 0 })).toBe('#00ff00')
      expect(rgbToHex({ r: 0, g: 0, b: 1 })).toBe('#0000ff')
      expect(rgbToHex({ r: 1, g: 1, b: 1 })).toBe('#ffffff')
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
    })

    it('should handle decimal values', () => {
      expect(rgbToHex({ r: 0.5, g: 0.5, b: 0.5 })).toBe('#808080')
      expect(rgbToHex({ r: 0.25, g: 0.5, b: 0.75 })).toBe('#4080bf')
    })

    it('should pad single digit hex values', () => {
      expect(rgbToHex({ r: 0.01, g: 0.01, b: 0.01 })).toBe('#030303')
    })
  })

  describe('hexToRgb', () => {
    it('should convert hex to RGB correctly', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 1, g: 0, b: 0 })
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 1, b: 0 })
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 1 })
      expect(hexToRgb('#ffffff')).toEqual({ r: 1, g: 1, b: 1 })
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    })

    it('should handle hex without # prefix', () => {
      expect(hexToRgb('ff0000')).toEqual({ r: 1, g: 0, b: 0 })
    })

    it('should return null for invalid hex', () => {
      expect(hexToRgb('')).toBeNull()
      expect(hexToRgb('#gg0000')).toBeNull()
      expect(hexToRgb('#ff00')).toBeNull()
      expect(hexToRgb('xyz')).toBeNull()
    })

    it('should handle mixed case', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 1, g: 0, b: 0 })
      expect(hexToRgb('#aAbBcC')).toEqual({ r: 170/255, g: 187/255, b: 204/255 })
    })
  })
})