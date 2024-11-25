import React, { useState, useEffect } from 'react';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';

interface Recipe {
    name: string;
    description: string;
    author: string;
    path: string;
    tags: string[];
}

export function Home() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        let mounted = true;

        const loadRecipes = async () => {
            try {
                const response = await fetch('/ai-recipes/data/recipes.json');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (mounted) {
                    setRecipes(Array.isArray(data) ? data : []);
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
    }, []);

    const filteredRecipes = recipes.filter(recipe => {
        const query = searchQuery.toLowerCase();
        return (
            recipe.name.toLowerCase().includes(query) ||
            recipe.description.toLowerCase().includes(query) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(query))
        );
    });

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-8">AI Recipe Hub</h1>
                <SearchBar
                    className="mb-8"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    disabled={true}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                        >
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-8">AI Recipe Hub</h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h2 className="text-lg font-medium text-red-800">Error loading recipes</h2>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                    <p className="text-sm text-gray-600 mt-2">Please check the console for more details</p>
                </div>
            </div>
        );
    }

    const hasRecipes = recipes.length > 0;
    const hasResults = filteredRecipes.length > 0;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">AI Recipe Hub</h1>
            <SearchBar
                className="mb-8"
                value={searchQuery}
                onChange={setSearchQuery}
            />

            {!hasRecipes ? (
                <div className="text-center py-8">
                    <h2 className="text-xl font-medium text-gray-900">No recipes found</h2>
                    <p className="text-gray-600 mt-2">
                        Try running the recipe processing script to generate some recipes
                    </p>
                    <pre className="mt-4 p-4 bg-gray-50 rounded text-left text-sm inline-block">
                        cd web{'\n'}
                        node scripts/process-recipes.js
                    </pre>
                </div>
            ) : !hasResults ? (
                <div className="text-center py-8">
                    <h2 className="text-xl font-medium text-gray-900">No matching recipes</h2>
                    <p className="text-gray-600 mt-2">
                        Try adjusting your search terms
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map(recipe => (
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
            )}
        </div>
    );
}