import { defineConfig } from 'eslint/config'
import { getConfig } from './fe-zen-arch/eslint.config.js'

const ignores = ['dist/', 'fe-zen-arch/', '**/*.js']

export default defineConfig(...getConfig(ignores, import.meta), {
  rules: {
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-unnecessary-type-conversion': 'off',
    'react-refresh/only-export-components': 'off'
  }
})
