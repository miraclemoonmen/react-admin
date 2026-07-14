import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [".react-router/**", "build/**", "dist/**", "node_modules/**"],
  },
  // JS 推荐规则
  js.configs.recommended,

  // TS 推荐规则
  tseslint.configs.recommended,

  // React 推荐规则
  pluginReact.configs.flat.recommended,

  // React Hooks 推荐规则（直接用 configs.flat.recommended，不用手动放 plugins）
  reactHooks.configs.flat.recommended,

  // Prettier
  eslintConfigPrettier,
  {
    languageOptions: { globals: globals.browser },
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off", // 禁用旧规则
      "@typescript-eslint/no-explicit-any": "off", // 允许使用 any
    },
  },
]);
