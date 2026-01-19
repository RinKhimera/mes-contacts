import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vitest/config"

const alias = {
  "@": path.resolve(__dirname, "./"),
}

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        statements: 75,
        branches: 75,
        functions: 75,
        lines: 75,
      },
      exclude: [
        "node_modules/**",
        "convex/_generated/**",
        "**/*.config.*",
        "**/*.d.ts",
        "components/ui/**",
        "app/**/layout.tsx",
        "app/**/page.tsx",
        "app/**/error.tsx",
        "app/**/not-found.tsx",
        "app/**/loading.tsx",
        "app/**/template.tsx",
        "providers/**",
        "tests/**",
        ".next/**",
        "dist/**",
        "out/**",
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "frontend",
          environment: "happy-dom",
          setupFiles: ["./vitest.setup.ts"],
          include: ["tests/**/*.test.{ts,tsx}"],
          exclude: ["tests/convex/**"],
        },
      },
      {
        extends: true,
        test: {
          name: "convex",
          environment: "edge-runtime",
          include: ["tests/convex/**/*.test.ts"],
          server: {
            deps: {
              inline: ["convex-test"],
            },
          },
        },
      },
    ],
  },
})
