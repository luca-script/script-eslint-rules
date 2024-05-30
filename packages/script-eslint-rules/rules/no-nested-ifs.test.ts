import rule from "./no-nested-ifs";
import { createRuleTester } from "../util/test-utils";

const ruleTester = createRuleTester();

ruleTester.run(rule.name, rule, {
    invalid: [
        {
            code: `if(A) if(B) {}`,
            errors: [
                {
                    messageId: "nestedIf",
                    line: 1,
                },
            ],
            name: "Simple nest",
        },
        {
            code: `if(A)\n\n\n\nif(B)\n\n\n{}`,
            errors: [
                {
                    messageId: "nestedIf",
                    line: 5,
                    endLine: 8,
                },
            ],
            name: "Simple nest with newlines",
        },
    ],
    valid: [
        {
            code: `if (A) for (const B of C) if (B) {}`,
        },
    ],
});
