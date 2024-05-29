import rule from "./no-func-declaration";
import { createRuleTester } from "../util/testutils";

const ruleTester = createRuleTester();

ruleTester.run(rule.name, rule, {
    invalid: [
        {
            code: "function hi(k: V): M {}",
            output: "const hi = (k: V): M => {}",
            errors: [
                {
                    messageId: "expectArrowFunction",
                    line: 1,
                    column: 1,
                },
            ],
            options: [],
            name: "Simple function",
        },
        {
            code: "async function hi(k: V): M {}",
            output: "const hi = async (k: V): M => {}",
            errors: [
                {
                    messageId: "expectArrowFunction",
                    line: 1,
                    column: 1,
                },
            ],
            name: "Simple async function",
        },
        {
            code: "const hi = async function(param: string): string {CONTENT}",
            output: "const hi = async (param: string): string => {CONTENT}",
            errors: [
                {
                    messageId: "expectArrowFunction",
                    line: 1,
                },
            ],
            name: "async function() assignment",
        },
        {
            code: "const hi = function(param: string): string {CONTENT}",
            output: "const hi = (param: string): string => {CONTENT}",
            errors: [
                {
                    messageId: "expectArrowFunction",
                    line: 1,
                },
            ],
            name: "function() assignment",
        },
    ],
    valid: [
        {
            code: "const hi = async (k: V): M => {}",
            name: "Simple async arrow function",
        },
        {
            code: "const hi = (k: V): M => {}",
            name: "Simple arrow function",
        },
    ],
});
