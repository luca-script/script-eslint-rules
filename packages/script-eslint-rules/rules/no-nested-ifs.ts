import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule } from "../util";

type Messages = "nestedIf";

export default createRule<[], Messages, "no-nested-ifs">({
    name: "no-nested-ifs",
    meta: {
        messages: {
            nestedIf: "Please merge nested if statements",
        },
        schema: [],
        type: "problem",
        docs: {
            description: "Hi",
        },
        configurations: {
            recommended: "warn",
        },
    },
    defaultOptions: [],
    create: (ctx) => {
        return {
            IfStatement: (node) => {
                if (node.parent.type === AST_NODE_TYPES.IfStatement) {
                    ctx.report({
                        messageId: "nestedIf",
                        node,
                    });
                }
            },
        };
    },
});
