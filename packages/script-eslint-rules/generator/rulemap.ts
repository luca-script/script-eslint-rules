import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import morph, { SyntaxKind } from "ts-morph";
import { exit } from "node:process";

const packageDir = join(import.meta.dir, "../");
const ruleDir = join(packageDir, "/rules/");

const imports: Array<{
    name: string;
    relativeFilePath: string;
    configs: Record<string, string>;
}> = [];
const files: string[] = [];

const project = new morph.Project({
    tsConfigFilePath: join(packageDir, "/tsconfig.json"),
    // skipAddingFilesFromTsConfig: true,
});

function handleMeta(meta: morph.ObjectLiteralElementLike | undefined) {
    const configs: Record<string, string> = {};

    if (meta !== undefined && meta.isKind(SyntaxKind.PropertyAssignment)) {
        const metaAssignment = meta.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
        if (metaAssignment !== undefined) {
            const configurationsAssignment = metaAssignment.getProperty("configurations");

            if (configurationsAssignment !== undefined && configurationsAssignment.isKind(SyntaxKind.PropertyAssignment)) {
                const configurations = configurationsAssignment.getInitializer();

                if (configurations && configurations.isKind(SyntaxKind.ObjectLiteralExpression)) {
                    configurations.getProperties().forEach((elem) => {
                        if (elem.isKind(SyntaxKind.PropertyAssignment)) {
                            const initializer = elem.getInitializer();
                            if (initializer && initializer.isKind(SyntaxKind.StringLiteral)) {
                                configs[elem.getNameNode().getText()] = initializer.getLiteralText();
                            }
                        }
                    });
                }
            }
        }
    }

    return {
        configs,
    };
}

function handleDeclaration(decl: morph.Node<morph.ts.Node>): {
    ruleName: string | null;
    configs: ReturnType<typeof handleMeta>["configs"];
} {
    let ruleName = null;
    let configs: ReturnType<typeof handleMeta>["configs"] = {};

    if (decl.isKind(morph.ts.SyntaxKind.ExportAssignment)) {
        const expr = decl.getExpression();
        if (morph.CallExpression.is(morph.SyntaxKind.CallExpression)(expr)) {
            expr.getTypeArguments().forEach((val, ind) => {
                // eslint-disable-next-line no-magic-numbers
                if (ind == 2) {
                    const type = val.getType();
                    if (type.isStringLiteral()) {
                        const literalValue = type.getLiteralValue();
                        if (typeof literalValue === "string") {
                            ruleName = literalValue;
                        }
                    }
                }
            });
            const args = expr.getArguments();
            if (args[0]) {
                const arg = args[0];
                if (arg.isKind(SyntaxKind.ObjectLiteralExpression)) {
                    const meta = arg.getProperty("meta");
                    const metadata = handleMeta(meta);
                    configs = metadata.configs;
                }
            }
        }
    }

    return {
        ruleName,
        configs,
    };
}

for (const filename of readdirSync(ruleDir).toSorted((a, b) => a.localeCompare(b))) {
    const path = join(ruleDir, filename);
    if (path.endsWith(".test.ts")) continue; // Test files, BORING

    project.addSourceFileAtPath(path);
    const sourceFile = project.getSourceFile(path);
    if (sourceFile === undefined) break;

    let ruleName: string | null = null;
    const configs: Record<string, string> = {};

    const exportSyms = sourceFile.getExportSymbols();
    for (const exportSym of exportSyms) {
        if (exportSym.getName() === "default") {
            for (const decl of exportSym.getDeclarations()) {
                const result = handleDeclaration(decl);
                for (const [key, value] of Object.entries(result.configs)) {
                    configs[key] = value;
                }
                result.ruleName !== null ? (ruleName = result.ruleName) : undefined;
            }
        }
    }

    const expectedRuleName = filename.replaceAll(/\.ts$/g, "");
    const actualRuleName = ruleName;
    if (actualRuleName === null) {
        console.log(`[!] Rulename is null on file: "${filename}"`);
        exit(1);
    }
    if (ruleName !== expectedRuleName) {
        console.log(`[!] Rulename is incorrect: ${ruleName} != ${expectedRuleName}`);
    }

    imports.push({
        name: actualRuleName,
        relativeFilePath: "../rules/" + basename(filename),
        configs: configs,
    });
    files.push(path);
}

const configRuleMap: Record<string, Array<{ imp: (typeof imports)[0]; index: number; level: string }>> = {};

imports.forEach((imp) => {
    for (const [index, [name, level]] of Object.entries(imp.configs).entries()) {
        if (!(name in configRuleMap)) {
            configRuleMap[name] = [];
        }
        configRuleMap[name].push({ imp, level, index });
    }
});

const genImports = () => {
    let text = ``;
    for (const [index, item] of imports.entries()) {
        text =
            text +
            `import r${index} from "${item.relativeFilePath.replaceAll("\\", "\\\\").replaceAll('"', '\\\\"').replace(/\.ts$/, "")}";\n`;
    }
    return text;
};

const getImports = () => {
    let str = "\n";

    for (const [index, item] of imports.entries()) {
        str = str + `    '${item.name.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}': r${index},\n`;
    }

    return str;
};

const genConfigs = () => {
    let text = `\n`;
    for (const [configName, configRules] of Object.entries(configRuleMap)) {
        text = text + `    '${configName.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}': { rules: { `;

        for (const { imp, level } of configRules) {
            text =
                text +
                `'script-eslint-rules/${imp.name.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}': '${level.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}' as const, `;
        }

        text = text + `}, plugins: { 'script-eslint-rules': plg } },\n`;
    }

    return text;
};

const code = `
// AUTO-GENERATED, DO NOT MODIFY, USE "yarn rebuild-rules"
${genImports()}


const rules = {${getImports()}};

function genConf(plg: any) {
const configs = {${genConfigs()}};

return configs;
}
export default {
    rules,
    genConf
};
`.trim();

try {
    mkdirSync(join(packageDir, "./gen"));
} catch (e) {
    /* Ignore, folder probably exists */
}
writeFileSync(join(packageDir, "./gen/gen.ts"), code);
