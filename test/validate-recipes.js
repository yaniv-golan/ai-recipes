const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const yaml = require('js-yaml');

const recipeSchema = require('../schema/recipe-schema.json');
const baseToolSchema = require('../schema/tool-schema.json');

// Update paths to tool schemas
const toolSchemas = {
    'claude.yaml': require('../schema/tools/claude.json'),
    'chatgpt.yaml': require('../schema/tools/chatgpt.json'),
    'perplexity.yaml': require('../schema/tools/perplexity.json'),
    'google_docs.yaml': require('../schema/tools/google-docs.json')
};

function validateTools() {
    const ajv = new Ajv();
    const toolsDir = path.join(__dirname, '..', 'tools');
    const toolFiles = fs.readdirSync(toolsDir);

    toolFiles.forEach((file) => {
        if (file.endsWith('.yaml')) {
            // First validate against base schema
            const baseValidate = ajv.compile(baseToolSchema);
            const toolPath = path.join(toolsDir, file);
            const toolYaml = fs.readFileSync(toolPath, 'utf8');
            const tool = yaml.safeLoad(toolYaml);

            const baseValid = baseValidate(tool);
            if (!baseValid) {
                console.error(
                    `Base schema validation errors in ${file}:`,
                    baseValidate.errors
                );
                return;
            }

            // Then validate against specific schema
            const schema = toolSchemas[file];
            if (!schema) {
                console.error(`No schema found for tool file: ${file}`);
                return;
            }

            const validate = ajv.compile(schema);
            const valid = validate(tool);
            if (!valid) {
                console.error(
                    `Tool-specific validation errors in ${file}:`,
                    validate.errors
                );
            } else {
                console.log(`${file} is valid.`);
            }
        }
    });
}

function validateRecipes() {
    const ajv = new Ajv();
    const validate = ajv.compile(recipeSchema);

    const recipesDir = path.join(__dirname, '..', 'recipes');
    const recipeFiles = fs.readdirSync(recipesDir);

    recipeFiles.forEach((authorDir) => {
        const authorPath = path.join(recipesDir, authorDir);
        if (fs.lstatSync(authorPath).isDirectory()) {
            const recipeDirs = fs.readdirSync(authorPath);
            recipeDirs.forEach((recipeDir) => {
                const recipePath = path.join(authorPath, recipeDir);
                const recipeFile = path.join(recipePath, 'recipe.yaml');
                if (fs.existsSync(recipeFile)) {
                    const recipeYaml = fs.readFileSync(recipeFile, 'utf8');
                    const recipe = yaml.safeLoad(recipeYaml);
                    const valid = validate(recipe);
                    if (!valid) {
                        console.error(
                            `Validation errors in ${recipeFile}:`,
                            validate.errors
                        );
                    } else {
                        console.log(`${recipeFile} is valid.`);
                    }
                }
            });
        }
    });
}

// Run validations
console.log('Validating tools...');
validateTools();

console.log('\nValidating recipes...');
validateRecipes(); 