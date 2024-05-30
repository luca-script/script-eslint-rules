import rule from "./no-new-promise";
import { createRuleTester } from "../util/test-utils";

const ruleTester = createRuleTester();

ruleTester.run(rule.name, rule, {
    invalid: [
        {
            code: "await new Promise()",
            errors: [
                {
                    messageId: "promiseConstructor",
                    line: 1,
                },
            ],
            name: "Await a promise",
        },
        {
            code: "const P = Promise;\nnew P()",
            errors: [
                {
                    messageId: "promiseConstructor",
                    line: 2,
                },
            ],
            name: "Variable reassignment",
        },
        {
            // TODO: Implement support for detecting class extends
            code: `
class F extends Promise { constructor(...t) {super(...t)}};

new F();
`.trim(),
            errors: [
                {
                    messageId: "promiseConstructor",
                    line: 3,
                },
            ],
            name: "Test",
            skip: true,
        },
    ],
    valid: [
        {
            // Bug we can't fix because TypeScript is unaware we reassigned Promise
            code: "const Promise = class {}; new Promise()",
            name: "False Promise",
            skip: true,
        },
    ],
});
