import React, { useState, useEffect } from 'react';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';
import { useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Recipe as RecipeType, WorkflowStep } from '../types/workflow';

interface ExtendedRecipe extends Omit<RecipeType, 'workflow'> {
    workflow: WorkflowStep[];
    path: string;
}

type SearchableField = {
    field: keyof ExtendedRecipe | 'workflow_steps' | 'parameters' | 'examples';
    weight: number;
};

const SEARCHABLE_FIELDS: SearchableField[] = [
    { field: 'name', weight: 10 },
    { field: 'description', weight: 8 },
    { field: 'tags', weight: 6 },
    { field: 'workflow_steps', weight: 5 },
    { field: 'parameters', weight: 4 },
    { field: 'examples', weight: 3 }
];

export function Home() {
    const [recipes, setRecipes] = useState<ExtendedRecipe[]>([]);
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
        console.debug('Loading recipes...');
        try {
            setLoading(true);
            setError(null);
            setRetrying(false);

            const response = await fetch('/ai-recipes/data/recipes.json');
            console.debug('Recipe data response:', { status: response.status, ok: response.ok });

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
            console.debug('Recipe data loaded:', { count: data?.length, data });

            if (!Array.isArray(data)) {
                throw new Error('Invalid recipe data format received');
            }

            setRecipes(data);
            console.debug('Recipes set in state:', { count: data.length });
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

    const searchInWorkflowSteps = (step: WorkflowStep, query: string): boolean => {
        return (
            step.name.toLowerCase().includes(query) ||
            step.description.toLowerCase().includes(query) ||
            (step.tool_usage || '').toLowerCase().includes(query) ||
            (step.prompt || '').toLowerCase().includes(query) ||
            (step.output_handling || '').toLowerCase().includes(query) ||
            (step.notes || '').toLowerCase().includes(query) ||
            step.tool.name.toLowerCase().includes(query)
        );
    };

    const searchInParameters = (recipe: ExtendedRecipe, query: string): boolean => {
        return recipe.parameters.some(param =>
            param.name.toLowerCase().includes(query) ||
            param.description.toLowerCase().includes(query) ||
            param.example.toLowerCase().includes(query)
        );
    };

    const searchInExamples = (recipe: ExtendedRecipe, query: string): boolean => {
        return recipe.examples.some(example =>
            example.sample_queries.some(q => q.toLowerCase().includes(query)) ||
            Object.values(example.parameters).some(value => value.toLowerCase().includes(query))
        );
    };

    const getSearchScore = (recipe: ExtendedRecipe, query: string): number => {
        console.debug('Calculating search score for recipe:', { recipe, query });
        try {
            let score = 0;
            const queryTerms = query.toLowerCase().split(/\s+/);

            for (const term of queryTerms) {
                for (const { field, weight } of SEARCHABLE_FIELDS) {
                    switch (field) {
                        case 'name':
                        case 'description':
                            if ((recipe[field] || '').toLowerCase().includes(term)) {
                                score += weight;
                                // Bonus for exact matches
                                if ((recipe[field] || '').toLowerCase() === term) {
                                    score += weight * 2;
                                }
                            }
                            break;
                        case 'tags':
                            if (recipe.tags?.some(tag => (tag || '').toLowerCase().includes(term))) {
                                score += weight;
                                // Bonus for exact tag matches
                                if (recipe.tags?.some(tag => (tag || '').toLowerCase() === term)) {
                                    score += weight * 2;
                                }
                            }
                            break;
                        case 'workflow_steps':
                            if (recipe.workflow?.some(step => searchInWorkflowSteps(step, term))) {
                                score += weight;
                            }
                            break;
                        case 'parameters':
                            if (searchInParameters(recipe, term)) {
                                score += weight;
                            }
                            break;
                        case 'examples':
                            if (searchInExamples(recipe, term)) {
                                score += weight;
                            }
                            break;
                    }
                }
            }

            console.debug('Search score calculated:', { recipe: recipe.name, query, score });
            return score;
        } catch (error) {
            console.error('Error calculating search score:', error, { recipe, query });
            return 0;
        }
    };

    const getFilteredAndSortedRecipes = () => {
        if (!searchQuery.trim()) {
            return recipes;
        }

        const scoredRecipes = recipes.map(recipe => ({
            recipe,
            score: getSearchScore(recipe, searchQuery.trim())
        }));

        // Filter out recipes with zero score and sort by score descending
        return scoredRecipes
            .filter(({ score }) => score > 0)
            .sort((a, b) => b.score - a.score)
            .map(({ recipe }) => recipe);
    };

    const filteredRecipes = getFilteredAndSortedRecipes();
    const hasRecipes = recipes.length > 0;
    const hasResults = filteredRecipes.length > 0;

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

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">AI Recipe Hub</h1>
            <SearchBar
                className="mb-8"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search recipes by name, description, tags, workflow steps, parameters, or examples..."
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
                    <p className="text-gray-500 mt-2 text-sm">
                        You can search by:
                        <ul className="list-disc list-inside mt-1">
                            <li>Recipe name and description</li>
                            <li>Tags</li>
                            <li>Workflow steps and prompts</li>
                            <li>Parameters and examples</li>
                        </ul>
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