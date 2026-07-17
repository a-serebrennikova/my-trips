import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const webRules = [...nextVitals, ...nextTs].map((config) => ({
  ...config,
  files: ["**/*.{js,mjs,cjs,ts,mts,jsx,tsx}"],
}));

export default defineConfig([
  ...webRules,
  globalIgnores([
    "**/node_modules/**",
    "**/coverage/**",
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/dist/**",
    "**/*.d.ts",
    "**/next-env.d.ts",
    "**/generated/**",
  ]),
]);
