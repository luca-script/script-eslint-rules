/// <reference types="@types/jest" />
/// <reference types="@types/node" />

import { resolve, join } from "node:path";
import { RuleTester } from "@typescript-eslint/rule-tester";

export function getFixturesRootDir() {
    return resolve(__dirname, "../fixture");
}

export function createRuleTester(): RuleTester {
    // const { RuleTester } = await i;
    RuleTester.afterAll = afterAll;
    RuleTester.it = it;
    RuleTester.itOnly = it.only;
    RuleTester.itSkip = it.skip;
    RuleTester.describe = describe;
    RuleTester.describeSkip = describe.skip;

    return new RuleTester({
        parser: "vue-eslint-parser",

        parserOptions: {
            parser: "@typescript-eslint/parser",
            ecmaVersion: 2023,
            tsconfigRootDir: getFixturesRootDir(),
            project: join(getFixturesRootDir(), "./tsconfig.json"),
        },
    });
}
