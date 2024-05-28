import type { JestConfigWithTsJest } from "ts-jest";

export default {
    preset: "ts-jest",
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "\\.ts$": [
            "ts-jest",
            {
                tsconfig: "./tsconfig.test.json",
            },
        ],
    },
    modulePathIgnorePatterns: ["dist"],
    testPathIgnorePatterns: ["dist"],
} as JestConfigWithTsJest;
