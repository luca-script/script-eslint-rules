import rule from "./no-relative-imports";
import { createRuleTester } from "../util/testutils";

const ruleTester = createRuleTester();

ruleTester.run(rule.name, rule, {
    invalid: [
        {
            code: `import * as My from "../hello.ts"`,
            errors: [
                {
                    messageId: "declaration",
                    line: 1,
                },
            ],
            name: "Relative import",
        },
        {
            code: `await import("../import.ts")`,
            name: "Relative import",
            errors: [
                {
                    messageId: "expression",
                    line: 1,
                },
            ],
        },
    ],
    valid: [
        {
            code: `import * as My from "./hello.ts"`,
            name: "Current folder import",
        },
        {
            code: `import * as My from "@hello.ts"`,
            name: "@ import",
        },
        {
            code: `await import("./import.ts")`,
            name: "Current folder awaited",
        },
    ],
});
