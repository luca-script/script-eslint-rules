import { TSESTree, type TSESLint } from "@typescript-eslint/utils";
import { createRule } from "../util";

export default createRule<[], "expressionStatement", "extract-lone-expressions">({
    meta: {
        fixable: "code",
        messages: {
            expressionStatement: "Singular expression statement in arrow function can be extracted",
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
            ArrowFunctionExpression: (node) => {
                if (node.body.type == TSESTree.AST_NODE_TYPES.BlockStatement) {
                    if (node.body.body.length === 1) {
                        if (node.body.body[0].type === TSESTree.AST_NODE_TYPES.ExpressionStatement) {
                            const startToken = ctx.sourceCode.getFirstToken(node.body);
                            if (startToken === null) {
                                throw new Error("Token expected");
                            }
                            const endToken = ctx.sourceCode.getLastToken(node.body);
                            if (endToken === null) {
                                throw new Error("Token expected");
                            }

                            const loc: TSESLint.AST.SourceLocation = {
                                start: startToken.loc.start,
                                end: endToken.loc.end,
                            };
                            ctx.report({
                                messageId: "expressionStatement",
                                node,
                                loc,
                                fix: (fixer) => {
                                    const fixes: TSESLint.RuleFix[] = [];

                                    const startBracket = ctx.sourceCode.getFirstToken(node.body);
                                    if (startBracket === null) return null;
                                    const afterStartBracket = ctx.sourceCode.getTokenAfter(startBracket);
                                    if (afterStartBracket === null) return null;

                                    fixes.push(fixer.removeRange([startBracket.range[0], afterStartBracket.range[0]]));
                                    fixes.push(fixer.insertTextBefore(startBracket, "("));

                                    const endBracket = ctx.sourceCode.getLastToken(node.body);
                                    if (endBracket === null) return null;
                                    const afterEndBracket = ctx.sourceCode.getTokenBefore(endBracket);
                                    if (afterEndBracket === null) return null;

                                    fixes.push(fixer.removeRange([afterEndBracket.range[0] + 1, endBracket.range[1]]));
                                    fixes.push(fixer.insertTextAfter(endBracket, ")"));

                                    if (afterEndBracket.type === TSESTree.AST_TOKEN_TYPES.Punctuator) {
                                        if (afterEndBracket.value === ";") {
                                            fixes.push(fixer.remove(afterEndBracket));
                                        }
                                    }

                                    return fixes;
                                },
                            });
                            return;
                        }
                    }
                }
            },
        };
    },
    name: "extract-lone-expressions",
});
