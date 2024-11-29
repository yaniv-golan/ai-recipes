import React, { useEffect, useState } from 'react';
import { generateYaml } from '../utils/yamlGenerator';
import { Parameter, WorkflowStep, Example } from '../types/workflow';
import { ToolSettings } from '../components/ToolsForm';

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
    const [copied, setCopied] = useState(false);
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

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(yaml);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([yaml], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.metadata.name}.yaml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Generated YAML</h3>
                <div className="space-x-4">
                    {!error && (
                        <>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Download
                            </button>
                            <button
                                type="button"
                                onClick={handleCreatePR}
                                disabled={isCheckingAuth}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {isCheckingAuth ? (
                                    'Checking GitHub...'
                                ) : githubUser ? (
                                    'Create Pull Request'
                                ) : (
                                    'Sign in with GitHub'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Error Generating YAML
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
                    <pre className="text-sm text-gray-100 font-mono whitespace-pre">
                        {yaml}
                    </pre>
                </div>
            )}

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                            What's next?
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>
                                {githubUser ? (
                                    <>
                                        Click "Create Pull Request" to submit your workflow to the repository.
                                        Your workflow will be created under your GitHub username: <strong>{githubUser}</strong>.
                                    </>
                                ) : (
                                    'Sign in with GitHub to create a pull request, or download the YAML file to submit it manually.'
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 