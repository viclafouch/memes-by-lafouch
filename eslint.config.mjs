import importsConfig from '@viclafouch/eslint-config-viclafouch/imports.mjs'
import baseConfig from '@viclafouch/eslint-config-viclafouch/index.mjs'
import nextConfig from '@viclafouch/eslint-config-viclafouch/next.mjs'
import prettierConfig from '@viclafouch/eslint-config-viclafouch/prettier.mjs'
import typescriptConfig from '@viclafouch/eslint-config-viclafouch/typescript.mjs'

/**
 * @type {import("eslint").Linter.Config}
 */
export default [
  ...baseConfig,
  ...nextConfig,
  ...importsConfig,
  ...typescriptConfig,
  ...prettierConfig,
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**']
  }
]
