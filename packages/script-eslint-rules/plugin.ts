import gen from "./gen/gen";
import { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

export const plugin = {
    rules: gen.rules,
    configs: {} as {
        [K in keyof ReturnType<typeof gen.genConf>]: FlatConfig.Config;
    } satisfies FlatConfig.SharedConfigs,
    meta: {
        name: "script-eslint-rules",
    },
} satisfies FlatConfig.Plugin;

plugin.configs = gen.genConf(plugin);

export default plugin;
