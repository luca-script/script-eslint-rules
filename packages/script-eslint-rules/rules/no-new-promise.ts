import { ESLintUtils } from "@typescript-eslint/utils";
import { createRule } from "../util";

export type Messages = "promiseConstructor";

export default createRule<[], Messages, "no-new-promise">({
    defaultOptions: [],
    meta: {
        docs: {
            description: "new Promise() can result in unreadable code",
            recommended: "strict",
        },
        messages: {
            promiseConstructor: "new Promise() is disallowed syntax",
        },
        schema: [],
        type: "problem",
        configurations: {
            recommended: "warn",
        },
    },
    name: "no-new-promise",
    create: (ctx) => {
        const services = ESLintUtils.getParserServices(ctx);
        return {
            NewExpression: (node) => {
                const type = services.getTypeAtLocation(node.callee);

                if (type.symbol.escapedName.toString() === "PromiseConstructor") {
                    ctx.report({
                        messageId: "promiseConstructor",
                        node: node.callee,
                    });
                }
            },
        };
    },
});
