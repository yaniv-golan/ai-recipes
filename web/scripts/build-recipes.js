const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Path to recipes directory (relative to project root)
const recipesDir = path.resolve(__dirname, '../../recipes');
const outputFile = path.resolve(__dirname, '../public/data/recipes.json');

// Ensure output directory exists
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

// Read all recipes
function loadRecipes() {
    const recipes = [];

    // Read user directories
    const users = fs.readdirSync(recipesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

    for (const user of users) {
        const userDir = path.join(recipesDir, user.name);

        // Read recipe directories
        const recipesDirs = fs.readdirSync(userDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory());

        for (const recipeDir of recipesDirs) {
            const recipePath = path.join(userDir, recipeDir.name);
            const recipeFile = path.join(recipePath, 'recipe.yaml');

            if (fs.existsSync(recipeFile)) {
                try {
                    const recipeYaml = fs.readFileSync(recipeFile, 'utf8');
                    const recipe = yaml.load(recipeYaml);
                    recipe.path = `${user.name}/${recipeDir.name}`;
                    recipe.author = user.name;
                    recipes.push(recipe);
                } catch (error) {
                    console.error(`Error loading recipe ${recipeFile}:`, error);
                }
            }
        }
    }

    return recipes;
}

// Build recipes.json
const recipes = loadRecipes();
fs.writeFileSync(outputFile, JSON.stringify(recipes, null, 2));
console.log(`Built ${recipes.length} recipes to ${outputFile}`); 