import { AST } from "vue-eslint-parser";
import { createRule } from "../util";
import type { TSESTree } from "@typescript-eslint/utils";

export default createRule<[], "computed", "no-class-computed-properties">({
    defaultOptions: [],
    meta: {
        docs: {
            description: "Be sensible with Vue",
        },
        messages: {
            computed: "No computed properties on the class property",
        },
        schema: [],
        type: "problem",
        configurations: {
            recommended: "error",
        },
    },
    create: (ctx) => {
        // console.log(Object.keys(ctx));

        return {
            Program: (node) => {
                const templateBody = (node as AST.ESLintProgram).templateBody;

                if (templateBody)
                    AST.traverseNodes(templateBody, {
                        enterNode(node, parent) {
                            if (parent !== null && (parent.type as string) === "VExpressionContainer") {
                                if (node.type == "ObjectExpression") {
                                    node.properties.forEach((prop) => {
                                        if (prop.type == "Property") {
                                            if (prop.computed) {
                                                if (parent.parent?.type == "VAttribute") {
                                                    if (parent.parent.key.type == "VDirectiveKey") {
                                                        if (parent.parent.key.argument?.type == "VIdentifier") {
                                                            if (parent.parent.key.argument.name == "class") {
                                                                ctx.report({
                                                                    node: prop as unknown as TSESTree.Node,
                                                                    messageId: "computed",
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        },
                        leaveNode: () => {},
                    });
            },
        };
    },
    name: "no-class-computed-properties",
});
