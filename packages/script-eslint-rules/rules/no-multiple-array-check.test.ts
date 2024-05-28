import rule from "./no-multiple-array-check";
import { createRuleTester } from "../util/testutils";

const ruleTester = createRuleTester();

ruleTester.run(rule.name, rule, {
    invalid: [
        {
            code: `
const myArr = ["Hello", "World"];

if(myArr.some(element => element === "Hello") || myArr.some(element => element === "World")) {}
`.trim(),
            errors: [
                {
                    messageId: "arraySome",
                },
            ],
            name: "Array.some",
        },
        {
            code: `
const myArr = ["Hello", "World"];

if(myArr.every(element => element === "Hello") || myArr.every(element => element === "World")) {}
`.trim(),
            errors: [
                {
                    messageId: "arrayEvery",
                },
            ],
            name: "Array.every",
        },
        {
            code: `
if([].every(element => element) || [].every(element => element)) {}
`.trim(),
            errors: [
                {
                    messageId: "arrayEvery",
                },
            ],
            name: "On an inline list",
        },
        {
            code: `
if([].some(element => element) || [].some(element => element)) {}
`.trim(),
            errors: [
                {
                    messageId: "arraySome",
                },
            ],
            name: "On an inline list",
        },
    ],
    valid: [
        {
            code: `
if([].every(element => element || element)) {}
`.trim(),
            name: "On an inline list",
        },
        {
            code: `
if([].some(element => element || element)) {}
`.trim(),
            name: "On an inline list [2]",
        },
    ],
});
