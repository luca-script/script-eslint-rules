import { TSESLint } from "@typescript-eslint/utils";
import gen from "./gen/gen";

export const plugin: TSESLint.FlatConfig.Plugin = {
    rules: gen.rules,
};

plugin.configs = gen.genConf(plugin);

export default plugin;
