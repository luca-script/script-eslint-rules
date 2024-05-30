/// <reference types="@types/jest" />
/// <reference types="@types/node" />

import { resolve, join } from "node:path";
import { RuleTester } from "@typescript-eslint/rule-tester";

// Fix typescript-eslint by making configType eslintrc! YAY!
jest.mock("@typescript-eslint/utils/ts-eslint", () => {
    const _ts = jest.requireActual<typeof import("@typescript-eslint/utils/ts-eslint")>("@typescript-eslint/utils/ts-eslint");
    const _es = jest.requireActual<typeof import("eslint")>("eslint");

    Object.setPrototypeOf(
        _ts.Linter,
        class extends _es.Linter {
            constructor() {
                super({ configType: "eslintrc" });
            }
        },
    );

    return _ts;
});

export function getFixturesRootDir() {
    return resolve(__dirname, "../fixture");
}

export function createRuleTester(): RuleTester {
    RuleTester.afterAll = afterAll;
    RuleTester.it = it;
    RuleTester.itOnly = it.only;
    RuleTester.itSkip = it.skip;
    RuleTester.describe = describe;
    RuleTester.describeSkip = describe.skip;

    return new RuleTester({
        parser: "vue-eslint-parser",
        // parser: "@typescript-eslint/parser",
        // parser: parser,

        parserOptions: {
            parser: "@typescript-eslint/parser",
            ecmaVersion: 2023,
            tsconfigRootDir: getFixturesRootDir(),
            project: join(getFixturesRootDir(), "./tsconfig.json"),
        },
    }) as unknown as RuleTester;
}
