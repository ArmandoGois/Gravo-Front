import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
  
  // Airbnb-style rules adapted for Next.js 15 + TypeScript
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "import": importPlugin,
      "react": react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": ["error", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      
      // React specific rules (Airbnb-based)
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/prop-types": "off", // Using TypeScript
      "react/jsx-props-no-spreading": "off",
      "react/require-default-props": "off",
      "react/jsx-filename-extension": ["error", { 
        extensions: [".tsx"] 
      }],
      "react/function-component-definition": ["error", {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      }],
      
      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // Import rules (Airbnb-style)
      "import/prefer-default-export": "off",
      "import/extensions": ["error", "ignorePackages", {
        ts: "never",
        tsx: "never",
      }],
      "import/no-unresolved": "off", // TypeScript handles this
      "import/order": ["error", {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index",
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      }],
      
      // Accessibility rules
      "jsx-a11y/anchor-is-valid": ["error", {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      }],
      
      // General code quality rules (Airbnb-style)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "quote-props": ["error", "as-needed"],
      "prefer-template": "error",
      "prefer-arrow-callback": "error",
      "arrow-body-style": ["error", "as-needed"],
      "no-param-reassign": ["error", {
        props: true,
        ignorePropertyModificationsFor: [
          "state", // for Zustand/Redux
          "draft", // for Immer
        ],
      }],
    },
  },
]);

export default eslintConfig;
