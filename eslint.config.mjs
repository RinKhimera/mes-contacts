import { FlatCompat } from "@eslint/eslintrc"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      ".convex/**",
      "convex/_generated/**",
      "public/**",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
      ".turbo/**",
      "dist/**",
    ],
  },
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react/no-unescaped-entities": "off",
    },
  }),
]

export default eslintConfig
