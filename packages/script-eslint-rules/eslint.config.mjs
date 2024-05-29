/* eslint-disable no-magic-numbers */
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const config = tseslint.config({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname,
        },
    },
    files: ["./**/*"],
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
