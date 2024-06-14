import * as fs from "fs";
import * as path from "path";
import axios from "axios";

// Helper function to recursively find all package.json files
const findPackageJsons = (dir, fileList: string[] = []) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            findPackageJsons(filePath, fileList);
        } else if (file === "package.json") {
            fileList.push(filePath);
        }
    });
    return fileList;
};

// Helper function to get advisories from NPM
const getAdvisories = async (packages: Record<string, string[]>) => {
    try {
        const response = await axios.post(`https://registry.npmjs.org/-/npm/v1/security/advisories/bulk`, packages);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch advisories:`, error instanceof Error ? error.message : error);
        return [];
    }
};

// Main function to find all package.json files and get security advisories
const checkSecurityAdvisories = async () => {
    const nodeModulesDir = path.join(__dirname, "node_modules");
    if (!fs.existsSync(nodeModulesDir)) {
        console.error("node_modules directory not found.");
        return;
    }

    const packageJsons = findPackageJsons(nodeModulesDir);
    console.log(`Found ${packageJsons.length} package.json files.`);

    const allPackages: Record<string, string[]> = {};

    for (const packageJsonPath of packageJsons) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        const deps = packageJson.dependencies as Record<string, string>;
        const devDeps = packageJson.devDependencies as Record<string, string>;
        const allDeps = {
            ...deps,
            ...devDeps,
        };

        Object.entries(allDeps).forEach(([packageName, version]) => {
            if (!(packageName in allPackages)) {
                allPackages[packageName] = [];
            }

            if (!allPackages[packageName].includes(version)) {
                allPackages[packageName].push(version);
            }
        });
    }

    console.log(
        Object.entries(allPackages).length,
        Object.entries(allPackages)
            .map(([name, versions]) => versions.length)
            .reduce((prev, curr) => prev + curr),
    );

    console.log(await getAdvisories(allPackages));
};

checkSecurityAdvisories();
