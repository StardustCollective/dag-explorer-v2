import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import EslintImportPlugin from "eslint-plugin-import";
import EslintUnusedImportsPlugin from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: [".next/**"] },
  {
    plugins: {
      import: EslintImportPlugin,
      "unused-imports": EslintUnusedImportsPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "off",
      "react-hooks/rules-of-hooks": "warn",
      ...EslintImportPlugin.configs.typescript.rules,
      "import/no-unresolved": [
        2,
        {
          ignore: [
            ".svg$",
            ".png$",
            ".jpg$",
            ".jpeg$",
            ".gif$",
            ".webp$",
            ".ico$",
          ],
        },
      ],
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
        },
      ],
      "unused-imports/no-unused-imports": "error",
    },
  },
];

export default eslintConfig;
