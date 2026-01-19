import nextConfig from "eslint-config-next"
import typescriptConfig from "eslint-config-next/typescript"
import coreWebVitalsConfig from "eslint-config-next/core-web-vitals"

const eslintConfig = [
  ...nextConfig,
  ...coreWebVitalsConfig,
  ...typescriptConfig,

  {
    files: ["next-env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },

  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".convex/**",
      "convex/_generated/**",
      "public/**",
      "*.tmp",
      "*.temp",
      ".env*",
      ".turbo/**",
    ],
  },
]

export default eslintConfig
