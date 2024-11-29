import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import * as Icons from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { TOOL_CONFIGS } from '../utils/tools';

interface Parameter {
    name: string;
    description: string;
    required: boolean;
    example?: string;
    default?: string;
}

interface RecipeData {
    name: string;
    description: string;
    longDescription?: string;
    author: string;
    path: string;
    tags?: string[];
    parameters: Record<string, Parameter>;
    workflow: Array<{
        id: string;
        name: string;
        tool: {
            name: string;
            description: string;
            settings: Record<string, any>;
        };
        description: string;
        tool_usage?: string;
        notes?: string;
        output_handling?: string;
        prompt?: string;
        input_source?: string;
    }>;
}

function highlightParameters(text: string, parameters: Record<string, string>) {
    if (!text) return text;
    return text.replace(/\{\{([^}]+)\}\}/g, (match, param) => {
        const value = parameters[param];
        return `<span class="bg-yellow-100 px-1 rounded">${value || match}</span>`;
    });
}

/**
 * Component for displaying tool icons with fallback handling
 * @param {object} props - Component props
 * @param {string} props.toolId - Tool ID to locate the icon
 * @param {string} props.name - Tool name for alt text
 * @param {string} props.className - Optional CSS classes
 * @returns {JSX.Element} Image element with fallback handling
 */
function ToolIcon({ toolId, name, className = "w-4 h-4" }: { toolId: string; name: string; className?: string }) {
    const [error, setError] = useState(false);
    const toolName = name.toLowerCase();
    const toolConfig = TOOL_CONFIGS[toolName];
    const iconPath = toolConfig?.icon || '/ai-recipes/tools/default-icon.svg';
    const defaultIcon = '/ai-recipes/tools/default-icon.svg';

    return (
        <img
            src={error ? defaultIcon : iconPath}
            alt={`${name} icon`}
            className={`${className} object-contain`}
            onError={() => setError(true)}
        />
    );
}

function renderMarkdown(content: string): string {
    if (!content) return '';
    marked.setOptions({
        gfm: true,
        breaks: true
    });
    const rendered = marked.parse(content);
    return typeof rendered === 'string' ? rendered : '';
}

// Create a separate component for prompt display
const PromptDisplay = React.memo(({ prompt, parameters }: { prompt: string; parameters: Record<string, string> }) => {
    console.log('PromptDisplay received parameters:', parameters);

    // Process each part of the text
    const parts = prompt.split(/(\{\{[^}]+\}\})/g);

    return (
        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-sm">
            {parts.map((part, index) => {
                // Check if this part is a parameter placeholder
                const match = part.match(/\{\{([^}]+)\}\}/);
                if (match) {
                    const paramName = match[1].trim();
                    const value = parameters[paramName];

                    // Always use yellow highlight for parameters
                    return (
                        <span
                            key={index}
                            className="bg-yellow-100 px-1 rounded"
                        >
                            {value || part}
                        </span>
                    );
                }

                return <span key={index}>{part}</span>;
            })}
        </pre>
    );
});

export function Recipe() {
    const { user, recipe } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<RecipeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStep, setSelectedStep] = useState<string | null>(null);
    const [parameterValues, setParameterValues] = useState<Record<string, string>>({});
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0);

    // Debug: Log parameter values whenever they change
    useEffect(() => {
        console.log('Parameter values changed:', parameterValues);
    }, [parameterValues]);

    const handleParameterChange = (name: string, value: string) => {
        console.log('Parameter change:', { name, value });
        setParameterValues(prev => {
            const newValues = {
                ...prev,
                [name.replace(/^0$/, 'company_name')]: value  // Temporary fix to map "0" to "company_name"
            };
            console.log('New parameter values:', newValues);
            return newValues;
        });
    };

    useEffect(() => {
        if (data && data.workflow.length > 0 && !selectedStep) {
            setSelectedStep(data.workflow[0].id);
        }
    }, [data]);

    const copyToClipboard = async (text: string) => {
        try {
            const processedText = text.replace(/\{\{([^}]+)\}\}/g, (match, param) => {
                return parameterValues[param] || match;
            });
            await navigator.clipboard.writeText(processedText);
            setCopyFeedback("Copied!");
            setTimeout(() => setCopyFeedback(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            setCopyFeedback("Failed to copy");
            setTimeout(() => setCopyFeedback(null), 2000);
        }
    };

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                // Include the base path in the fetch URL
                const response = await fetch('/ai-recipes/data/recipes.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch recipe data: ${response.status} ${response.statusText}`);
                }

                const recipes = await response.json();
                console.log('Loaded recipes:', recipes);  // Debug log

                const recipeData = recipes.find((r: RecipeData) => r.path === `${user}/${recipe}`);
                console.log('Found recipe:', recipeData);  // Debug log

                if (!recipeData) {
                    throw new Error('Recipe not found');
                }

                setData(recipeData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recipe:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [user, recipe]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="text-lg font-medium">Loading recipe...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="text-lg font-medium text-red-600">Error loading recipe</div>
                    <div className="text-sm text-gray-500">{error}</div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="text-lg font-medium">Recipe not found</div>
                </div>
            </div>
        );
    }

    const currentStep = selectedStep && data
        ? data.workflow.find(step => step.id === selectedStep)
        : data?.workflow[0];

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <Card>
                <CardHeader>
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                {data.name}
                                <span className="text-sm font-normal text-gray-600">
                                    by{' '}
                                    <Link
                                        to={`/author/${data.author}`}
                                        className="hover:text-indigo-600 hover:underline"
                                    >
                                        {data.author}
                                    </Link>
                                </span>
                            </h1>
                        </div>
                        <div
                            className="prose prose-sm max-w-none text-gray-600"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(data.description) }}
                        />
                        {data.tags && data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.tags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => navigate('/?tag=' + encodeURIComponent(tag))}
                                        className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </CardHeader>
            </Card>

            {data?.parameters && Object.keys(data.parameters).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(data.parameters).map(([name, param]) => (
                                <div key={param.name} className="space-y-2">
                                    <label className="block">
                                        <span className="text-sm font-medium text-gray-900">
                                            {param.name}
                                            {param.required && <span className="text-red-500 ml-1">*</span>}
                                        </span>
                                        <span className="block text-sm text-gray-500">{param.description}</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={parameterValues[param.name] || ''}
                                        onChange={(e) => handleParameterChange(param.name, e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${param.required
                                            ? 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                            : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'
                                            }`}
                                        placeholder={`Enter ${param.name}...`}
                                        required={param.required}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Workflow Steps</h2>
                    <div className="relative space-y-4">
                        {data.workflow.map((step, index) => (
                            <div key={step.id} className="relative">
                                <div
                                    onClick={() => setSelectedStep(step.id)}
                                    className={`
                                        w-full p-4 rounded-md cursor-pointer
                                        bg-white border border-gray-200 transition-all
                                        relative
                                        ${selectedStep === step.id
                                            ? 'ring-2 ring-blue-500 shadow-md'
                                            : 'hover:border-gray-300'
                                        }
                                    `}
                                >
                                    {selectedStep === step.id && (
                                        <div className="absolute -right-[20px] top-1/2 -mt-[10px] w-0 h-0 
                                            border-t-[10px] border-t-transparent
                                            border-l-[10px] border-l-red-500
                                            border-b-[10px] border-b-transparent
                                            z-10"
                                        />
                                    )}
                                    <div className="space-y-2">
                                        <div className="font-medium text-gray-900">{index + 1}. {step.name}</div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <ToolIcon toolId={step.tool.name} name={step.tool.name} />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>{step.tool.name}</TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs text-sm">{step.tool.description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        {step.description && (
                                            <div className="text-sm text-gray-500">{step.description}</div>
                                        )}
                                        <div className="space-y-1 text-xs">
                                            {step.input_source && (
                                                <div className="text-gray-500">
                                                    <span className="font-medium">Input: </span>
                                                    {step.input_source}
                                                </div>
                                            )}
                                            {step.output_handling && (
                                                <div className="text-gray-500">
                                                    <span className="font-medium">Output: </span>
                                                    {step.output_handling}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {index < data.workflow.length - 1 && (
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-4 bg-gray-300" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {currentStep && (
                    <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">{currentStep.name}</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <ToolIcon toolId={currentStep.tool.name} name={currentStep.tool.name} />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>Tool: {currentStep.tool.name}</TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs text-sm">{currentStep.tool.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        {currentStep.description && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                                <div className="text-sm text-gray-600">{currentStep.description}</div>
                            </div>
                        )}

                        {currentStep.tool_usage && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Tool Usage</h3>
                                <div className="text-sm text-gray-600 whitespace-pre-wrap">{currentStep.tool_usage}</div>
                            </div>
                        )}

                        {currentStep.notes && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
                                <div className="text-sm text-gray-600">{currentStep.notes}</div>
                            </div>
                        )}

                        {currentStep?.prompt && (
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-medium text-gray-900">Prompt Template</h3>
                                    <button
                                        onClick={() => copyToClipboard(currentStep.prompt)}
                                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 min-w-[70px] justify-end"
                                    >
                                        {copyFeedback ? (
                                            <span className="text-green-600">{copyFeedback}</span>
                                        ) : (
                                            <>
                                                <Icons.Copy className="w-4 h-4" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                <PromptDisplay
                                    prompt={currentStep.prompt}
                                    parameters={parameterValues}
                                    key={JSON.stringify(parameterValues)} // Force re-render when parameters change
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}