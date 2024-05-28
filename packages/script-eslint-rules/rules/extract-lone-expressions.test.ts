import rule from "./extract-lone-expressions";
import { createRuleTester } from "../util/testutils";

const ruleTester = createRuleTester();

ruleTester.run(rule.name, rule, {
    invalid: [
        {
            code: "const my = () => {console.log('Hi!')}",
            output: "const my = () => (console.log('Hi!'))",
            errors: [
                {
                    messageId: "expressionStatement",
                    line: 1,
                },
            ],
            name: "Simple expression",
        },
        {
            code: "const my = async () => {console.log('Hi!')}",
            output: "const my = async () => (console.log('Hi!'))",
            errors: [
                {
                    messageId: "expressionStatement",
                    line: 1,
                },
            ],
            name: "Async simple expression",
        },
    ],
    valid: [],
});
