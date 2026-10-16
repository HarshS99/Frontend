import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*-test.ts', 'src/**/*-test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      ui: path.resolve(process.cwd(), './fe-zen-arch/ui'),
      core: path.resolve(process.cwd(), './fe-zen-arch/core'),
      icons: path.resolve(process.cwd(), './fe-zen-arch/icons')
    }
  }
})
