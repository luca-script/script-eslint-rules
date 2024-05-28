import rule from "./no-anonymous-classes";
import { createRuleTester } from "../util/testutils";

const ruleTester = createRuleTester();

ruleTester.run(rule.name, rule, {
    invalid: [
        {
            code: "const test = class {}",
            errors: [
                {
                    messageId: "anonymous",
                    line: 1,
                    column: 14,
                    endColumn: 22,
                    endLine: 1,
                },
            ],
            name: "Simple",
        },
        {
            code: "const test = class extends Useless {}",
            errors: [
                {
                    messageId: "anonymous",
                    line: 1,
                    column: 14,
                    endColumn: 38,
                    endLine: 1,
                },
            ],
            name: "With extends",
        },
    ],
    valid: [
        {
            code: "const test = class Name {}",
            name: "With name",
        },
        {
            code: "const test = class Name extends Useless {}",
            name: "With name and extends",
        },
    ],
});
