import rule from "./no-class-computed-properties";
import { createRuleTester } from "../util/testutils";

const ruleTester = createRuleTester();

ruleTester.run(rule.name, rule, {
    invalid: [
        {
            code: `<template>\n<p :class="{['a' + 'b']: true}">\n</template>`,
            errors: [
                {
                    messageId: "computed",
                    line: 2,
                },
            ],
            name: "Computed expression 1",
        },
    ],
    valid: [
        {
            code: `<template>\n<p :class="{ 'a': 'B', c: 'D' }">\n</template>`,
            name: "Valid non-computed expression",
        },
    ],
});
