import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const config = tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, {
    languageOptions: {
        parserOptions: {
            project: ["./tsconfig.test.json", "./packages/script-eslint-rules/tsconfig.json"],
            // tsconfigRootDir: import.meta.dirname,
        },
    },
    files: ["packages/**/*"],
    ignores: ["dist/*", "**/gen/**/*"],
});

console.log(config.ignores);

export default config;
