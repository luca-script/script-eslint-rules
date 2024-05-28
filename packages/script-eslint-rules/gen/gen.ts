// AUTO-GENERATED, DO NOT MODIFY, USE "yarn rebuild-rules"
import r0 from "../rules/no-func-declaration";
import r1 from "../rules/extract-lone-expressions";
import r2 from "../rules/no-relative-imports";
import r3 from "../rules/no-class-computed-properties";
import r4 from "../rules/no-new-promise";
import r5 from "../rules/no-anonymous-classes";



const rules = {
    'no-func-declaration': r0,
    'extract-lone-expressions': r1,
    'no-relative-imports': r2,
    'no-class-computed-properties': r3,
    'no-new-promise': r4,
    'no-anonymous-classes': r5,
};

function genConf(plg: any) {
const configs = {
    'recommended': { rules: { 'script-eslint-rules/no-func-declaration': 'warn' as const, 'script-eslint-rules/extract-lone-expressions': 'warn' as const, 'script-eslint-rules/no-relative-imports': 'warn' as const, 'script-eslint-rules/no-class-computed-properties': 'error' as const, 'script-eslint-rules/no-new-promise': 'warn' as const, 'script-eslint-rules/no-anonymous-classes': 'error' as const, }, plugins: { 'script-eslint-rules': plg } },
};

return configs;
}
export default {
    rules,
    genConf
};