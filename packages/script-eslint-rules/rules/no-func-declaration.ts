import { TSESLint, TSESTree } from "@typescript-eslint/utils";
import { createRule } from "../util";

export default createRule<[], "expectArrowFunction", "no-func-declaration">({
    create(ctx) {
        const declarationFixer = (node: TSESTree.FunctionDeclaration) => (fixer: TSESLint.RuleFixer) => {
            const fixes: TSESLint.RuleFix[] = [];

            if (node.id !== null) {
                const funcName = ctx.sourceCode.getFirstToken(node.id);
                if (funcName === null) return null;
                fixes.push(fixer.insertTextBefore(funcName, "const "));
                fixes.push(fixer.insertTextAfter(funcName, " = "));

                const funcKeyword = ctx.sourceCode.getTokenBefore(funcName);
                if (funcKeyword === null) return null;
                fixes.push(
                    fixer.removeRange([
                        ctx.sourceCode.getIndexFromLoc(funcKeyword.loc.start),
                        ctx.sourceCode.getIndexFromLoc(funcKeyword.loc.end) + 1,
                    ]),
                );

                const beforeFuncName = ctx.sourceCode.getTokenBefore(funcKeyword);
                if (beforeFuncName) {
                    if (beforeFuncName.type == TSESTree.AST_TOKEN_TYPES.Identifier && beforeFuncName.value == "async" && node.async) {
                        // fixes.push(fixer.remove(beforeFuncName));
                        fixes.push(fixer.removeRange([beforeFuncName.range[0], beforeFuncName.range[1] + 1]));
                        fixes.push(fixer.insertTextAfter(funcName, "async "));
                    }
                }

                // fixes.push(fixer.insertTextAfter())
                const bodyFirst = ctx.sourceCode.getFirstToken(node.body);
                if (bodyFirst === null) return null;

                const before = ctx.sourceCode.getTokenBefore(bodyFirst);
                if (before === null) return null;

                fixes.push(fixer.insertTextAfter(before, " =>"));
            }

            return fixes;
        };

        const propertyExpressionFixer = (node: TSESTree.FunctionExpression) => (fixer: TSESLint.RuleFixer) => {
            const fixes: TSESLint.RuleFix[] = [];
            const first = ctx.sourceCode.getFirstToken(node);

            if (!first) return null;

            // {
            //   e: function() {}
            // }
            if (
                (first.type == TSESTree.AST_TOKEN_TYPES.Keyword && first.value == "function") ||
                (first.type == TSESTree.AST_TOKEN_TYPES.Identifier && first.value == "async")
            ) {
                const isAsync = first.value == "async";

                const afterFirst = ctx.sourceCode.getTokenAfter(first);
                if (afterFirst && afterFirst.type == TSESTree.AST_TOKEN_TYPES.Keyword && afterFirst.value == "function") {
                    if (ctx.sourceCode.isSpaceBetween(first, afterFirst)) {
                        fixes.push(fixer.removeRange([first.range[0], first.range[1] + 1]));
                    } else {
                        fixes.push(fixer.removeRange([first.range[0], first.range[1]]));
                    }
                    fixes.push(fixer.removeRange([afterFirst.range[0], afterFirst.range[1] + 1]));
                } else {
                    fixes.push(fixer.removeRange([first.range[0], first.range[1]]));
                }

                const punc = ctx.sourceCode.getFirstToken(node.body);

                if (!punc) return null;

                if (isAsync) {
                    fixes.push(fixer.insertTextBefore(node, "async "));
                }

                fixes.push(fixer.insertTextBefore(punc, "=> "));
            }
            // {
            //   f() {}
            // }
            else {
                const punc = ctx.sourceCode.getFirstToken(node.body);
                if (!punc) return null;

                fixes.push(fixer.insertTextBefore(punc, "=> "));

                fixes.push(fixer.insertTextBefore(first, ": "));
                if (node.parent.type == TSESTree.AST_NODE_TYPES.Property) {
                    const parent = node.parent;
                    const firstParentNode = ctx.sourceCode.getFirstToken(parent);
                    if (
                        firstParentNode &&
                        firstParentNode.type == TSESTree.AST_TOKEN_TYPES.Identifier &&
                        firstParentNode.value == "async"
                    ) {
                        fixes.push(fixer.removeRange([firstParentNode.range[0], firstParentNode.range[1] + 1]));
                        fixes.push(fixer.insertTextBefore(node, "async "));
                    }
                }
            }
            return fixes;
        };

        const genericExpressionFixer = (node: TSESTree.FunctionExpression) => (fixer: TSESLint.RuleFixer) => {
            const fixes: TSESLint.RuleFix[] = [];
            let currentToken = ctx.sourceCode.getFirstToken(node);
            if (currentToken === null) return null;

            if (currentToken.type === TSESTree.AST_TOKEN_TYPES.Identifier && currentToken.value === "async") {
                currentToken = ctx.sourceCode.getTokenAfter(currentToken);
            }
            if (currentToken === null) return null;

            if (currentToken.type === TSESTree.AST_TOKEN_TYPES.Keyword && currentToken.value === "function") {
                fixes.push(fixer.removeRange(currentToken.range));
            } else return null;

            const punc = ctx.sourceCode.getFirstToken(node.body);
            if (punc === null) return null;

            fixes.push(fixer.insertTextBefore(punc, "=> "));

            return fixes;
        };

        return {
            FunctionDeclaration: (node) => {
                const parent = node.parent;

                if (
                    parent.type == TSESTree.AST_NODE_TYPES.ExportNamedDeclaration ||
                    parent.type == TSESTree.AST_NODE_TYPES.ExportDefaultDeclaration ||
                    parent.type == TSESTree.AST_NODE_TYPES.Program
                ) {
                    ctx.report({
                        messageId: "expectArrowFunction",
                        node: node,
                        fix: declarationFixer(node),
                    });
                }
            },
            FunctionExpression: (node) => {
                const parent = node.parent;
                if (parent.type == TSESTree.AST_NODE_TYPES.Property || parent.type == TSESTree.AST_NODE_TYPES.ArrayExpression) {
                    ctx.report({
                        messageId: "expectArrowFunction",
                        node,
                        fix: propertyExpressionFixer(node),
                    });
                } else {
                    ctx.report({
                        messageId: "expectArrowFunction",
                        node,
                        fix: genericExpressionFixer(node),
                    });
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        messages: {
            expectArrowFunction: "Expected arrow function, found function declaration",
        },
        schema: [],
        type: "problem",
        fixable: "code",
        docs: {
            description: "Correct function declarations",
        },
        configurations: {
            recommended: "warn",
        },
    },
    name: "no-func-declaration",
});
