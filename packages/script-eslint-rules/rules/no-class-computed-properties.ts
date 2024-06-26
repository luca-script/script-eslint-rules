import { AST as VueAST } from "vue-eslint-parser";
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
            strict: "error",
        },
    },
    create: (ctx) => {
        // console.log(Object.keys(ctx));

        return {
            Program: (node) => {
                const templateBody = (node as VueAST.ESLintProgram).templateBody;

                if (!templateBody) return;
                VueAST.traverseNodes(templateBody, {
                    enterNode(node, parent) {
                        if (parent !== null && (parent.type as string) === "VExpressionContainer") {
                            if (node.type == "ObjectExpression") {
                                node.properties.forEach((prop) => {
                                    if (
                                        prop.type == "Property" &&
                                        prop.computed &&
                                        parent.parent?.type == "VAttribute" &&
                                        parent.parent.key.type == "VDirectiveKey" &&
                                        parent.parent.key.argument?.type == "VIdentifier" &&
                                        parent.parent.key.argument.name == "class"
                                    ) {
                                        ctx.report({
                                            // Cast it as a TypeScript-compatible node
                                            node: prop as unknown as TSESTree.Node,
                                            messageId: "computed",
                                        });
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
