import type { RuleListener, RuleModule } from "@typescript-eslint/utils/eslint-utils";

export const createRule = <Options extends readonly unknown[], MessageIds extends string, Name extends string>(
    module: RuleModule<MessageIds, Options, RuleListener> & {
        name: Name;
        meta: {
            configurations?: { [key: string]: "warn" | "error" };
        };
    },
): RuleModule<MessageIds, Options, RuleListener> & {
    name: Name;
} => {
    return module;
};
