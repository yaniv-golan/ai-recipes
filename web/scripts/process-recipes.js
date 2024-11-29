import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function readFileIfExists(filePath) {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (err) {
        if (err.code === 'ENOENT') {
            return null;
        }
        throw err;
    }
}

function generateMermaidDiagram(workflow) {
    let mermaid = 'graph TD\n';

    workflow.forEach((step, index) => {
        const nextStep = workflow[index + 1];
        const stepId = step.id || `step${index + 1}`;
        const nextStepId = nextStep ? (nextStep.id || `step${index + 2}`) : null;

        // Add node
        mermaid += `    ${stepId}["${step.name}<br/>${step.tool.name}"]\n`;

        // Add connection to next step
        if (nextStepId) {
            mermaid += `    ${stepId} --> ${nextStepId}\n`;
        }
    });

    return mermaid;
}

/**
 * Copy tool icons to the public directory
 * @param {object} tools - Map of tool configurations
 * @param {string} outputDir - Output directory path
 */
async function copyToolIcons(tools, outputDir) {
    // Copy to /public/tools - this is where Vite serves static assets from
    const toolsPublicDir = path.join(__dirname, '../public/tools');
    await fs.mkdir(toolsPublicDir, { recursive: true });

    // Copy default icon
    const defaultIconSrc = path.join(__dirname, '../../tools/default-icon.svg');
    const defaultIconDest = path.join(toolsPublicDir, 'default-icon.svg');
    try {
        await fs.copyFile(defaultIconSrc, defaultIconDest);
    } catch (err) {
        console.warn('Default icon not found:', err);
    }

    // Copy each tool's icon
    for (const [toolId, toolConfig] of Object.entries(tools)) {
        const toolDir = path.join(toolsPublicDir, toolId);
        await fs.mkdir(toolDir, { recursive: true });

        // Try SVG first, then WebP
        let iconCopied = false;
        for (const format of ['svg', 'webp']) {
            const iconSrc = path.join(__dirname, '../../tools', toolId, `icon.${format}`);
            const iconDest = path.join(toolDir, `icon.${format}`);

            try {
                await fs.access(iconSrc);
                await fs.copyFile(iconSrc, iconDest);
                iconCopied = true;
                break;
            } catch (err) {
                // Continue to next format if file doesn't exist
                if (err.code !== 'ENOENT') {
                    console.error(`Error copying ${format} icon for tool ${toolId}:`, err);
                }
            }
        }

        if (!iconCopied) {
            console.warn(`No icon found for tool ${toolId}`);
        }
    }
}

// Load tool definitions
async function loadTools() {
    const toolsDir = path.join(__dirname, '..', '..', 'tools');
    const toolDirs = await fs.readdir(toolsDir);
    const tools = {};

    for (const dir of toolDirs) {
        const toolPath = path.join(toolsDir, dir);
        const stat = await fs.stat(toolPath);

        if (stat.isDirectory()) {
            const yamlPath = path.join(toolPath, 'tool.yaml');
            try {
                const toolYaml = await fs.readFile(yamlPath, 'utf8');
                const toolConfig = yaml.load(toolYaml);
                tools[toolConfig.id] = toolConfig;
            } catch (err) {
                console.warn(`Could not load tool from ${dir}:`, err);
            }
        }
    }

    return tools;
}

/**
 * Process tool configuration and handle icon paths
 * @param {string} toolId - The tool's identifier
 * @param {object} toolConfig - The tool's configuration from tool.yaml
 * @returns {object} Processed tool configuration with icon URL
 */
function processTool(toolId, toolConfig) {
    // Try SVG first, fallback to WebP
    const toolDir = path.join(__dirname, '../../tools', toolId);
    const iconPath = existsSync(path.join(toolDir, 'icon.svg'))
        ? `./tools/${toolId}/icon.svg`
        : existsSync(path.join(toolDir, 'icon.webp'))
            ? `./tools/${toolId}/icon.webp`
            : './tools/default-icon.svg';

    return {
        type: toolId,
        name: toolConfig.name || toolId,
        iconUrl: iconPath,  // Used by ToolIcon component in Recipe.tsx
        settings: toolConfig.settings || {},
        used_for: toolConfig.used_for || []
    };
}

// Process a single recipe
function processRecipe(recipe, tools) {
    if (!recipe.workflow) return recipe;

    recipe.workflow = recipe.workflow.map((step) => {
        // Handle both formats: string ID and object with name
        const toolId = typeof step.tool === 'string' ? step.tool : step.tool.name.toLowerCase();

        if (!toolId || !tools[toolId]) {
            console.warn(`Tool ${toolId} not found for step ${step.id}`);
            return step;
        }

        const toolConfig = tools[toolId];
        let settings = {};

        // For tools with models (like Claude, ChatGPT)
        if (toolConfig.models && step.tool.model) {
            const modelConfig = toolConfig.models.find(m => m.name === step.tool.model);
            if (modelConfig) {
                settings = { ...modelConfig.settings };
            } else {
                console.warn(`Model ${step.tool.model} not found for tool ${toolId}`);
            }
        }
        // For tools with default settings (like Perplexity, Google Docs)
        else if (toolConfig.default_settings) {
            settings = { ...toolConfig.default_settings };
        }

        // Apply any step-specific setting overrides
        if (step.tool.settings) {
            settings = { ...settings, ...step.tool.settings };
        }

        // Use the processTool function to get consistent icon handling
        const processedTool = processTool(toolId, toolConfig);

        return {
            ...step,
            tool: {
                id: toolId,
                name: toolConfig.name,
                description: toolConfig.description,
                iconUrl: processedTool.iconUrl,
                settings
            },
            ...(step.prompt && typeof step.prompt === 'string' && step.prompt.trim() !== ''
                ? { prompt: step.prompt.toString() }
                : {})
        };
    });

    return recipe;
}

async function processRecipes() {
    try {
        const recipesDir = path.resolve(__dirname, '../../recipes');
        const outputDir = path.resolve(__dirname, '../public/data');
        const tools = await loadTools();

        console.log('Processing recipes from:', recipesDir);
        console.log('Output directory:', outputDir);

        // Ensure output directory exists and copy tool icons
        await fs.mkdir(outputDir, { recursive: true });
        await copyToolIcons(tools, outputDir);

        // Create an empty array if no recipes directory exists yet
        let recipes = [];

        try {
            const users = await fs.readdir(recipesDir);

            for (const user of users) {
                const userPath = path.join(recipesDir, user);
                const userStat = await fs.stat(userPath);

                if (userStat.isDirectory()) {
                    console.log('Processing user directory:', user);

                    const userRecipes = await fs.readdir(userPath);

                    for (const recipe of userRecipes) {
                        const recipePath = path.join(userPath, recipe);
                        const recipeStat = await fs.stat(recipePath);

                        if (recipeStat.isDirectory()) {
                            console.log('Processing recipe:', recipe);

                            try {
                                const recipeYamlPath = path.join(recipePath, 'recipe.yaml');
                                const recipeData = await fs.readFile(recipeYamlPath, 'utf8');
                                const recipeYaml = yaml.load(recipeData);

                                const descriptionPath = path.join(recipePath, 'description.md');
                                const description = await readFileIfExists(descriptionPath);

                                // Process the recipe with tool settings
                                const processedRecipe = processRecipe(recipeYaml, tools);

                                recipes.push({
                                    ...processedRecipe,
                                    author: user,
                                    path: `${user}/${recipe}`,
                                    description: description || processedRecipe.description,
                                    longDescription: description,
                                    parameters: processedRecipe.parameters || {},
                                    workflow: (processedRecipe.workflow || []).map(step => ({
                                        ...step,
                                        prompt: step.prompt ? step.prompt.toString() : null
                                    }))
                                });

                                console.log('Successfully processed recipe:', recipe);
                            } catch (err) {
                                console.error(`Error processing recipe ${recipe}:`, err);
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.warn('No recipes found or error reading recipes directory:', err);
        }

        // Always write the output files, even if empty
        const outputPath = path.join(outputDir, 'recipes.json');
        await fs.writeFile(
            outputPath,
            JSON.stringify(recipes, null, 2)
        );

        console.log('Successfully wrote recipes to:', outputPath);
        console.log('Total recipes processed:', recipes.length);

        // Create search index even if empty
        const searchIndex = recipes.map(recipe => ({
            id: recipe.path,
            title: recipe.name,
            description: recipe.description,
            tags: recipe.tags,
            author: recipe.author
        }));

        const searchIndexPath = path.join(outputDir, 'search-index.json');
        await fs.writeFile(
            searchIndexPath,
            JSON.stringify(searchIndex, null, 2)
        );

        console.log('Successfully wrote search index to:', searchIndexPath);
    } catch (err) {
        console.error('Error processing recipes:', err);
        process.exit(1);
    }
}

processRecipes();