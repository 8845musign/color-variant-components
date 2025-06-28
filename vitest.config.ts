import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h, Fragment } from 'preact'`
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '*.config.ts',
        'build/',
        'dist/'
      ]
    }
  },
  css: {
    modules: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@figma/plugin-typings': resolve(__dirname, './src/test/mocks/figma.ts'),
      'react': 'preact/compat',
      'react-dom': 'preact/compat'
    }
  },
  assetsInclude: ['**/*.css']
})