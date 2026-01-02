import nextConfig from "eslint-config-next"

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
      "next-env.d.ts",
    ],
  },
  ...nextConfig,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]

export default eslintConfig
