const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const yaml = require('js-yaml');

const recipeSchema = require('../schema/recipe-schema.json');
const toolIdentitySchema = {
    type: "object",
    required: ["id", "name", "description", "icon"],
    properties: {
        id: {
            type: "string",
            pattern: "^[a-z][a-z0-9_-]*$"
        },
        name: {
            type: "string"
        },
        description: {
            type: "string"
        },
        icon: {
            type: "string",
            pattern: "^icon\\.(svg|webp)$",
            description: "Must be either icon.svg or icon.webp"
        }
    },
    additionalProperties: false
};

function validateTools() {
    const ajv = new Ajv();
    const validateToolIdentity = ajv.compile(toolIdentitySchema);
    const toolsDir = path.join(__dirname, '..', 'tools');
    const toolDirs = fs.readdirSync(toolsDir).filter(f =>
        fs.statSync(path.join(toolsDir, f)).isDirectory()
    );

    let hasErrors = false;
    toolDirs.forEach((dir) => {
        const toolYamlPath = path.join(toolsDir, dir, 'tool.yaml');
        if (fs.existsSync(toolYamlPath)) {
            const toolYaml = fs.readFileSync(toolYamlPath, 'utf8');
            const tool = yaml.load(toolYaml);

            // Schema validation
            const valid = validateToolIdentity(tool);
            if (!valid) {
                console.error(
                    `Tool identity validation errors in ${toolYamlPath}:`,
                    validateToolIdentity.errors
                );
                hasErrors = true;
            } else {
                // Verify icon file exists
                const iconPath = path.join(toolsDir, dir, tool.icon);
                if (!fs.existsSync(iconPath)) {
                    console.error(`Icon file not found for ${dir}: ${tool.icon}`);
                    hasErrors = true;
                } else {
                    console.log(`${toolYamlPath} validation passed.`);
                }
            }
        }
    });
    return !hasErrors;
}

function extractParameterRefs(text) {
    if (!text) return new Set();
    const pattern = /\{\{([a-zA-Z][a-zA-Z0-9_]*)\}\}/g;
    const matches = [...text.matchAll(pattern)];
    return new Set(matches.map(m => m[1]));
}

function validateParameterUsage(recipe, recipePath) {
    const errors = [];

    // Get defined parameters
    const definedParams = new Set(recipe.parameters.map(p => p.name));

    // Find all parameter references in workflow prompts
    const usedParams = new Set();
    recipe.workflow.forEach(step => {
        if (step.prompt) {
            const refs = extractParameterRefs(step.prompt);
            refs.forEach(ref => usedParams.add(ref));

            // Check if all referenced parameters are defined
            for (const ref of refs) {
                if (!definedParams.has(ref)) {
                    errors.push(`Step '${step.id}' references undefined parameter: ${ref}`);
                }
            }
        }
    });

    // Check if all defined parameters are used
    for (const param of definedParams) {
        if (!usedParams.has(param)) {
            errors.push(`Defined parameter '${param}' is never used`);
        }
    }

    if (errors.length > 0) {
        console.error(`\nParameter validation errors in ${recipePath}:`);
        errors.forEach(error => console.error(`  - ${error}`));
        return false;
    }
    return true;
}

async function validateRecipe(recipePath) {
    const ajv = new Ajv();
    const validate = ajv.compile(recipeSchema);
    const toolsDir = path.join(__dirname, '..', 'tools');

    const recipeFile = path.join(recipePath, 'recipe.yaml');
    if (fs.existsSync(recipeFile)) {
        const recipeYaml = fs.readFileSync(recipeFile, 'utf8');
        const recipe = yaml.load(recipeYaml);

        // Schema validation
        const valid = validate(recipe);
        if (!valid) {
            console.error(
                `Schema validation errors in ${recipeFile}:`,
                validate.errors
            );
            return false;
        }

        console.log(`${recipeFile} schema validation passed.`);

        // Validate tools exist
        for (const step of recipe.workflow) {
            const toolId = step.tool.name;
            const toolDir = path.join(toolsDir, toolId);
            const toolYamlPath = path.join(toolDir, 'tool.yaml');

            if (!fs.existsSync(toolDir)) {
                console.error(`Tool directory not found for ${toolId}`);
                return false;
            }

            if (!fs.existsSync(toolYamlPath)) {
                console.error(`Tool configuration not found: ${toolYamlPath}`);
                return false;
            }

            try {
                const toolConfig = yaml.load(fs.readFileSync(toolYamlPath, 'utf8'));
                const iconPath = path.join(toolDir, toolConfig.icon);

                if (!fs.existsSync(iconPath)) {
                    console.error(`Tool ${toolId} icon file ${toolConfig.icon} not found`);
                    return false;
                }
            } catch (err) {
                console.error(`Failed to validate tool ${toolId}: ${err.message}`);
                return false;
            }
        }

        // Parameter usage validation
        if (!validateParameterUsage(recipe, recipePath)) {
            return false;
        }

        console.log(`${recipeFile} parameter validation passed.`);
        return true;
    }
    return false;
}

function validateRecipes() {
    const recipesDir = path.join(__dirname, '..', 'recipes');
    const recipeFiles = fs.readdirSync(recipesDir);
    let hasErrors = false;

    recipeFiles.forEach((authorDir) => {
        const authorPath = path.join(recipesDir, authorDir);
        if (fs.lstatSync(authorPath).isDirectory()) {
            const recipeDirs = fs.readdirSync(authorPath);
            recipeDirs.forEach((recipeDir) => {
                const recipePath = path.join(authorPath, recipeDir);
                const recipeFile = path.join(recipePath, 'recipe.yaml');
                if (fs.existsSync(recipeFile)) {
                    const recipeYaml = fs.readFileSync(recipeFile, 'utf8');
                    const recipe = yaml.load(recipeYaml);

                    // Schema validation
                    const valid = validate(recipe);
                    if (!valid) {
                        console.error(
                            `Schema validation errors in ${recipeFile}:`,
                            validate.errors
                        );
                        hasErrors = true;
                    } else {
                        console.log(`${recipeFile} schema validation passed.`);

                        // Parameter usage validation
                        if (!validateParameterUsage(recipe, recipeFile)) {
                            hasErrors = true;
                        } else {
                            console.log(`${recipeFile} parameter validation passed.`);
                        }
                    }
                }
            });
        }
    });

    if (hasErrors) {
        process.exit(1);
    }
}

// Run validations
console.log('Validating tools...');
const toolsValid = validateTools();

console.log('\nValidating recipes...');
const recipesValid = validateRecipes();

if (!toolsValid || !recipesValid) {
    process.exit(1);
} 