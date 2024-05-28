import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import { createRule } from "../util";

type Messages = "arrayEvery" | "arraySome";

export default createRule<[], Messages, "no-multiple-array-check">({
    name: "no-multiple-array-check",
    meta: {
        messages: {
            arrayEvery: "Move OR and AND conditions on the results of array.every into the callback function",
            arraySome: "Move OR and AND conditions on the results of array.some into the callback function",
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
        const services = ESLintUtils.getParserServices(ctx);

        return {
            LogicalExpression: (node) => {
                const isDoingArraySomeOrEvery = [node.left, node.right]
                    .map((subNode): string | boolean => {
                        if (subNode.type === AST_NODE_TYPES.CallExpression) {
                            const calleeSym = services.getSymbolAtLocation(subNode.callee);
                            if (calleeSym === undefined) return false;
                            if (subNode.callee.type === AST_NODE_TYPES.MemberExpression) {
                                const sym = services.getTypeAtLocation(subNode.callee.object);
                                if (sym === undefined) return false;
                                if (sym.getSymbol()?.getName() === "Array") {
                                    return calleeSym.getName();
                                }
                            }
                        }
                        return false;
                    })
                    .reduce((prev, current) => {
                        switch (typeof prev) {
                            case "string":
                                return prev === current ? prev : false;
                            case "boolean":
                                return false;
                        }
                    });

                if (isDoingArraySomeOrEvery === "some") {
                    ctx.report({
                        messageId: "arraySome",
                        node,
                    });
                } else if (isDoingArraySomeOrEvery === "every") {
                    ctx.report({
                        messageId: "arrayEvery",
                        node,
                    });
                }
            },
        };
    },
});
