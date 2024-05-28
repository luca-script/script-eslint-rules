import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { createRule } from "../util";

type Messages = "expression" | "declaration";

export default createRule<[{ allowParentImports: boolean }], Messages, "no-relative-imports">({
    name: "no-relative-imports",
    meta: {
        messages: {
            declaration: "Do not use relative imports to import from parent directories, always use absolute paths",
            expression: "Do not use relative imports to import from parent directories, always use absolute paths",
        },
        schema: [
            {
                type: "object",
                properties: {
                    allowParentImports: {
                        type: "boolean",
                        description: "Allow ../ relative imports",
                    },
                },
                additionalProperties: false,
            },
        ],
        type: "problem",
        docs: {
            description: "Hi",
        },
        configurations: {
            recommended: "warn",
        },
    },
    create: (ctx) => {
        let allowParentImports = false;
        if (ctx.options.length >= 1) {
            allowParentImports = ctx.options[0].allowParentImports;
        }
        const checkImport = (source: string, node: TSESTree.Node, messageId: Messages) => {
            if (source.startsWith("..")) {
                if (!allowParentImports)
                    ctx.report({
                        node,
                        messageId,
                    });
            }
        };

        return {
            ImportDeclaration: (node) => {
                checkImport(node.source.value, node.source, "declaration");
            },
            ImportExpression: (node) => {
                if (node.source.type === AST_NODE_TYPES.Literal && typeof node.source.value === "string") {
                    checkImport(node.source.value, node.source, "expression");
                }
            },
        };
    },
    defaultOptions: [{ allowParentImports: true }],
});
