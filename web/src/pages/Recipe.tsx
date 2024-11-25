import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import MarkdownViewer from '../components/MarkdownViewer';
import MermaidViewer from '../components/MermaidViewer';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

interface RecipeData {
    name: string;
    description: string;
    author: string;
    readme: string;
    path: string;
    tags?: string[];
    workflow: Array<{
        id: string;
        name: string;
        tool: string;
        description: string;
        output_handling?: string;
    }>;
}

function generateMermaidDiagram(workflow: RecipeData['workflow']): string {
    let mermaid = 'graph TD\n';

    // Add nodes and connections
    workflow.forEach((step, index) => {
        // Add node
        mermaid += `    ${step.id}["${step.name}<br/>(${step.tool})"]\n`;

        // Add connection to next step
        if (index < workflow.length - 1) {
            const nextStep = workflow[index + 1];
            mermaid += `    ${step.id} -->|${step.output_handling || 'Output'}| ${nextStep.id}\n`;
        }
    });

    return mermaid;
}

export function Recipe() {
    const { user, recipe } = useParams();
    const [data, setData] = useState<RecipeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                console.log('Fetching recipe for:', { user, recipe });
                const response = await fetch('/ai-recipes/data/recipes.json');

                if (!response.ok) {
                    throw new Error('Failed to fetch recipe');
                }

                const recipes = await response.json();
                console.log('Found recipes:', recipes);

                const recipeData = recipes.find(
                    (r: RecipeData) => r.path === `${user}/${recipe}`
                );

                if (!recipeData) {
                    throw new Error('Recipe not found');
                }

                console.log('Found recipe data:', recipeData);
                setData(recipeData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recipe:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [user, recipe]);

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="text-lg font-medium">Loading recipe...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="text-lg font-medium text-red-600">Error loading recipe</div>
                <div className="text-sm text-gray-500">{error}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 text-center">
                <div className="text-lg font-medium">Recipe not found</div>
            </div>
        );
    }

    const mermaidDiagram = generateMermaidDiagram(data.workflow);

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {data.name}
                    </CardTitle>
                    <div className="text-gray-600 mt-2">
                        {data.description}
                    </div>
                    {data.tags && data.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {data.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Workflow</h2>
                        <MermaidViewer
                            chart={mermaidDiagram}
                            className="bg-white p-4 rounded-lg shadow-sm"
                        />
                    </div>
                    <div className="prose max-w-none">
                        {data.readme && (
                            <div
                                className="markdown-content"
                                dangerouslySetInnerHTML={{
                                    __html: marked.parse(data.readme)
                                }}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}