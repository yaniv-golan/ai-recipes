import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';

interface Recipe {
    name: string;
    description: string;
    author: string;
    path: string;
    tags: string[];
}

export function Author() {
    const { author } = useParams();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const loadRecipes = async () => {
            try {
                const response = await fetch('/ai-recipes/data/recipes.json');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const authorRecipes = Array.isArray(data)
                    ? data.filter(recipe => recipe.author === author)
                    : [];

                if (mounted) {
                    setRecipes(authorRecipes);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error loading recipes:', err);
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Unknown error');
                    setLoading(false);
                }
            }
        };

        loadRecipes();

        return () => {
            mounted = false;
        };
    }, [author]);

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-8">Recipes by {author}</h1>
                <div className="text-gray-600 mb-4">Loading recipes...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-8">Recipes by {author}</h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h2 className="text-lg font-medium text-red-800">Error loading recipes</h2>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-8">Recipes by {author}</h1>
                <div className="text-center py-8">
                    <h2 className="text-xl font-medium text-gray-900">No recipes found</h2>
                    <p className="text-gray-600 mt-2">
                        This author hasn't published any recipes yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Recipes by {author}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                    <RecipeCard
                        key={recipe.path}
                        title={recipe.name}
                        description={recipe.description}
                        author={recipe.author}
                        path={recipe.path}
                        tags={recipe.tags}
                    />
                ))}
            </div>
        </div>
    );
} 