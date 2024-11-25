import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function processRecipes() {
    try {
        // Updated paths to be more explicit
        const recipesDir = path.resolve(__dirname, '../../recipes');
        const outputDir = path.resolve(__dirname, '../public/data');

        console.log('Processing recipes from:', recipesDir);
        console.log('Output directory:', outputDir);

        // Ensure output directory exists
        await fs.mkdir(outputDir, { recursive: true });

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

                                const readmePath = path.join(recipePath, 'README.md');
                                const readme = await fs.readFile(readmePath, 'utf8');

                                recipes.push({
                                    ...recipeYaml,
                                    author: user,
                                    path: `${user}/${recipe}`,
                                    readme,
                                    parameters: recipeYaml.parameters || {},
                                    workflow: (recipeYaml.workflow || []).map(step => ({
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
        console.error('Error in recipe processing:', err);
        process.exit(1);
    }
}

// Add some error handling around the main execution
try {
    console.log('Starting recipe processing...');
    await processRecipes();
    console.log('Recipe processing completed successfully');
} catch (err) {
    console.error('Fatal error in recipe processing:', err);
    process.exit(1);
}