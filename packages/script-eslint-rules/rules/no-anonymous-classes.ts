import { createRule } from "../util";

export type Messages = "anonymous";

export default createRule<[], Messages, "no-anonymous-classes">({
    meta: {
        messages: {
            anonymous: "Do not use anonymous classes, always give them a formal name",
        },
        schema: [],
        type: "problem",
        configurations: {
            recommended: "error",
            strict: "error",
        },
    },
    defaultOptions: [],
    name: "no-anonymous-classes",
    create: (ctx) => {
        return {
            ClassExpression: (node) => {
                if (node.id === null) {
                    ctx.report({
                        messageId: "anonymous",
                        node,
                    });
                }
            },
        };
    },
});
