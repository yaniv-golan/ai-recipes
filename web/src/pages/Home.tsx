import React, { useState, useEffect } from 'react';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';
import { useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

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
    const [retrying, setRetrying] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Get tag from URL if present
        const params = new URLSearchParams(location.search);
        const tagFromUrl = params.get('tag');
        if (tagFromUrl) {
            setSearchQuery(tagFromUrl);
        }
    }, [location.search]);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            setError(null);
            setRetrying(false);

            const response = await fetch('/ai-recipes/data/recipes.json');

            if (!response.ok) {
                let errorMessage = `Failed to load recipes (HTTP ${response.status})`;
                if (response.status === 404) {
                    errorMessage = 'Recipe data not found. Have you run the recipe processing script?';
                } else if (response.status === 403) {
                    errorMessage = 'Access to recipe data is forbidden. Please check your permissions.';
                } else if (response.status >= 500) {
                    errorMessage = 'Server error occurred while loading recipes. Please try again later.';
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error('Invalid recipe data format received');
            }

            setRecipes(data);
        } catch (err) {
            console.error('Error loading recipes:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred while loading recipes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecipes();
    }, []);

    const handleRetry = async () => {
        setRetrying(true);
        await loadRecipes();
    };

    const handleTagClick = (tag: string) => {
        setSearchQuery(tag);
    };

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
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg" role="status" aria-live="polite">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-3" aria-hidden="true" />
                    <span className="text-lg text-gray-600">
                        {retrying ? 'Retrying...' : 'Loading recipes...'}
                    </span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-8">AI Recipe Hub</h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6" role="alert">
                    <div className="flex items-center mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600 mr-3" aria-hidden="true" />
                        <h2 className="text-lg font-medium text-red-800">Failed to Load Recipes</h2>
                    </div>
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                    {error.includes('processing script') ? (
                        <div className="mt-2 p-4 bg-gray-50 rounded text-sm">
                            <p className="font-medium mb-2">Run these commands to generate recipes:</p>
                            <pre className="bg-white p-3 rounded">
                                cd web{'\n'}
                                node scripts/process-recipes.js
                            </pre>
                        </div>
                    ) : (
                        <button
                            onClick={handleRetry}
                            disabled={retrying}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            aria-label="Retry loading recipes"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${retrying ? 'animate-spin' : ''}`} aria-hidden="true" />
                            {retrying ? 'Retrying...' : 'Try Again'}
                        </button>
                    )}
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
                <div className="text-center py-8 bg-gray-50 rounded-lg" role="status">
                    <h2 className="text-xl font-medium text-gray-900">No Recipes Available</h2>
                    <p className="text-gray-600 mt-2 mb-4">
                        Run the recipe processing script to generate recipes:
                    </p>
                    <pre className="inline-block p-4 bg-white rounded border border-gray-200 text-left text-sm">
                        cd web{'\n'}
                        node scripts/process-recipes.js
                    </pre>
                </div>
            ) : !hasResults ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg" role="status">
                    <h2 className="text-xl font-medium text-gray-900">No Matching Recipes</h2>
                    <p className="text-gray-600 mt-2">
                        Try adjusting your search terms or clearing the search to see all {recipes.length} recipes.
                    </p>
                </div>
            ) : (
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    role="list"
                    aria-label={`Found ${filteredRecipes.length} recipes`}
                >
                    {filteredRecipes.map(recipe => (
                        <RecipeCard
                            key={recipe.path}
                            title={recipe.name}
                            description={recipe.description}
                            author={recipe.author}
                            path={recipe.path}
                            tags={recipe.tags}
                            onTagClick={handleTagClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}