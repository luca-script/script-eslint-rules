import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { dirname, resolve, join } from "path";

const config = tseslint.config({
    extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
        parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname,
        },
    },
    files: ["packages/**/*"],
    ignores: ["dist/*", "**/gen/**/*"],
    rules: {
        "max-depth": ["error", 4],
        "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
        "no-magic-numbers": [
            "error",
            {
                ignoreArrayIndexes: true,
                ignoreDefaultValues: true,
                enforceConst: false,
                detectObjects: false,
                ignore: [-1, -0, 1],
            },
        ],
    },
});

export default config;
