import React, { useEffect, useState } from 'react';
import { generateYaml } from '../utils/yamlGenerator';
import { Parameter, WorkflowStep, Example, ToolSettings } from '../types/workflow';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_client_id';
const GITHUB_REDIRECT_URI = `${window.location.origin}/github/callback`;

type PreviewFormProps = {
    data: {
        metadata: {
            name: string;
            description: string;
            tags: string[];
        };
        parameters: Parameter[];
        tools?: ToolSettings;
        workflow: WorkflowStep[];
        tips: string[];
        examples: Example[];
    };
};

export function PreviewForm({ data }: PreviewFormProps) {
    const [yaml, setYaml] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [githubUser, setGithubUser] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(false);

    useEffect(() => {
        // Check GitHub authentication status on mount
        checkGitHubAuth();
    }, []);

    useEffect(() => {
        try {
            const generatedYaml = generateYaml(data);
            setYaml(generatedYaml);
            setError(null);
        } catch (err) {
            console.error('Error generating YAML:', err);
            setError(err instanceof Error ? err.message : 'Error generating YAML');
            setYaml('');
        }
    }, [data]);

    const checkGitHubAuth = async () => {
        setIsCheckingAuth(true);
        try {
            // Try to get the user info from GitHub
            const token = localStorage.getItem('github_token');
            if (!token) {
                setGithubUser(null);
                return;
            }

            const response = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get GitHub user info');
            }

            const userInfo = await response.json();
            setGithubUser(userInfo.login);
        } catch (err) {
            console.error('Error checking GitHub auth:', err);
            setGithubUser(null);
            localStorage.removeItem('github_token');
        } finally {
            setIsCheckingAuth(false);
        }
    };

    const handleGitHubLogin = () => {
        // Store current form state in localStorage to restore after auth
        localStorage.setItem('pending_workflow', JSON.stringify(data));

        // Redirect to GitHub OAuth
        const params = new URLSearchParams({
            client_id: GITHUB_CLIENT_ID,
            redirect_uri: GITHUB_REDIRECT_URI,
            scope: 'repo',
            state: Math.random().toString(36).substring(7),
        });

        window.location.href = `https://github.com/login/oauth/authorize?${params}`;
    };

    const handleCreatePR = () => {
        if (!githubUser) {
            handleGitHubLogin();
            return;
        }

        const encodedYaml = encodeURIComponent(yaml);
        const prTitle = encodeURIComponent(`Add ${data.metadata.name} workflow`);
        const prBody = encodeURIComponent(
            `Add new workflow: ${data.metadata.name}\n\n${data.metadata.description}`
        );
        const path = encodeURIComponent(
            `recipes/${githubUser}/${data.metadata.name}/recipe.yaml`
        );

        const url = `https://github.com/yaniv-golan/ai-recipes/new/main?filename=${path}&value=${encodedYaml}&message=${prTitle}&description=${prBody}`;
        window.open(url, '_blank');
    };

    const handleDownload = () => {
        const blob = new Blob([yaml], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recipe.yaml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6" role="form" aria-label="Recipe Preview Form">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label htmlFor="recipe-name" className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <input
                        id="recipe-name"
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter recipe name"
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="recipe-description" className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500" aria-label="required">*</span>
                        <span className="text-gray-500 text-xs ml-1" aria-label="maximum 500 characters">(max 500 characters)</span>
                    </label>
                    <textarea
                        id="recipe-description"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        rows={3}
                        placeholder="Brief overview of what this recipe does"
                        required
                        maxLength={500}
                        aria-required="true"
                    />
                </div>
            </div>
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium" id="yaml-section">Generated YAML</h3>
                <div className="space-x-2">
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label="Download YAML file"
                    >
                        Download YAML
                    </button>
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4" role="alert" aria-live="polite">
                    <div className="flex">
                        <div className="flex-shrink-0" aria-hidden="true">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <pre
                        className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"
                        aria-labelledby="yaml-section"
                        role="region"
                        tabIndex={0}
                    >
                        {yaml}
                    </pre>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4" role="region" aria-label="Submission Instructions">
                        <div className="flex">
                            <div className="flex-shrink-0" aria-hidden="true">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    How to Submit Your Recipe
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ol className="list-decimal list-inside space-y-1">
                                        <li>Click "Download YAML" to save your recipe</li>
                                        <li>Fork the repository on GitHub</li>
                                        <li>Create a new branch: <code>recipe/your-recipe-name</code></li>
                                        <li>Add your YAML file to: <code>recipes/your-username/recipe-name/recipe.yaml</code></li>
                                        <li>Create a pull request</li>
                                    </ol>
                                    <p className="mt-2">
                                        <a
                                            href="https://github.com/yaniv-golan/ai-recipes/blob/main/docs/contributing.md#recipe-submission-options"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
                                            aria-label="View detailed submission instructions (opens in new tab)"
                                        >
                                            View detailed submission instructions →
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 