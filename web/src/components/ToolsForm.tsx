import React from 'react';

export type ToolSettings = {
    chatgpt: {
        used_for: string[];
        settings: {
            model: 'GPT-4o' | 'GPT-4o with canvas' | 'o1-preview' | 'o1-mini';
            enable_web_search: boolean;
            custom_gpt: {
                name: string;
                url: string;
            } | null;
        };
    };
    claude: {
        used_for: string[];
        settings: {
            model: 'Claude 3.5 Sonnet' | 'Claude 3 Opus';
            enable_artifacts: boolean;
            enable_analysis_tool: boolean;
        };
    };
    perplexity: {
        used_for: string[];
        settings: {
            focus: 'Web' | 'Academic' | 'Math' | 'Writing' | 'Video' | 'Social';
            enable_pro: boolean;
        };
    };
    google_docs: {
        used_for: string[];
        settings: {
            enable_markdown: boolean;
        };
    };
};

type ToolsFormProps = {
    tools: ToolSettings;
    onChange: (tools: ToolSettings) => void;
};

export function ToolsForm({ tools, onChange }: ToolsFormProps) {
    const handleUsageChange = (tool: keyof ToolSettings, value: string) => {
        if (value.trim()) {
            const updatedTools = {
                ...tools,
                [tool]: {
                    ...tools[tool],
                    used_for: [...tools[tool].used_for, value.trim()],
                },
            };
            onChange(updatedTools);
        }
    };

    const handleRemoveUsage = (tool: keyof ToolSettings, index: number) => {
        const updatedTools = {
            ...tools,
            [tool]: {
                ...tools[tool],
                used_for: tools[tool].used_for.filter((_, i) => i !== index),
            },
        };
        onChange(updatedTools);
    };

    const handleSettingChange = (
        tool: keyof ToolSettings,
        setting: string,
        value: any
    ) => {
        const updatedTools = {
            ...tools,
            [tool]: {
                ...tools[tool],
                settings: {
                    ...tools[tool].settings,
                    [setting]: value,
                },
            },
        };
        onChange(updatedTools);
    };

    const handleCustomGPTChange = (field: 'name' | 'url', value: string) => {
        const updatedTools = {
            ...tools,
            chatgpt: {
                ...tools.chatgpt,
                settings: {
                    ...tools.chatgpt.settings,
                    custom_gpt: {
                        ...tools.chatgpt.settings.custom_gpt,
                        [field]: value,
                    },
                },
            },
        };
        onChange(updatedTools);
    };

    return (
        <div className="space-y-8">
            {/* ChatGPT Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">ChatGPT Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Model</label>
                        <select
                            value={tools.chatgpt.settings.model}
                            onChange={(e) => handleSettingChange('chatgpt', 'model', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="GPT-4o">GPT-4o</option>
                            <option value="GPT-4o with canvas">GPT-4o with canvas</option>
                            <option value="o1-preview">o1-preview</option>
                            <option value="o1-mini">o1-mini</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="chatgpt-web-search"
                            checked={tools.chatgpt.settings.enable_web_search}
                            onChange={(e) =>
                                handleSettingChange('chatgpt', 'enable_web_search', e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="chatgpt-web-search" className="ml-2 block text-sm text-gray-700">
                            Enable web search
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Custom GPT</label>
                        <div className="mt-1 space-y-2">
                            <input
                                type="text"
                                placeholder="Custom GPT Name"
                                value={tools.chatgpt.settings.custom_gpt?.name || ''}
                                onChange={(e) => handleCustomGPTChange('name', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <input
                                type="url"
                                placeholder="Custom GPT URL"
                                value={tools.chatgpt.settings.custom_gpt?.url || ''}
                                onChange={(e) => handleCustomGPTChange('url', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Claude Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Claude Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Model</label>
                        <select
                            value={tools.claude.settings.model}
                            onChange={(e) => handleSettingChange('claude', 'model', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                            <option value="Claude 3 Opus">Claude 3 Opus</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="claude-artifacts"
                            checked={tools.claude.settings.enable_artifacts}
                            onChange={(e) =>
                                handleSettingChange('claude', 'enable_artifacts', e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="claude-artifacts" className="ml-2 block text-sm text-gray-700">
                            Enable artifacts
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="claude-analysis"
                            checked={tools.claude.settings.enable_analysis_tool}
                            onChange={(e) =>
                                handleSettingChange('claude', 'enable_analysis_tool', e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="claude-analysis" className="ml-2 block text-sm text-gray-700">
                            Enable analysis tool
                        </label>
                    </div>
                </div>
            </div>

            {/* Perplexity Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Perplexity Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Focus</label>
                        <select
                            value={tools.perplexity.settings.focus}
                            onChange={(e) => handleSettingChange('perplexity', 'focus', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="Web">Web</option>
                            <option value="Academic">Academic</option>
                            <option value="Math">Math</option>
                            <option value="Writing">Writing</option>
                            <option value="Video">Video</option>
                            <option value="Social">Social</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="perplexity-pro"
                            checked={tools.perplexity.settings.enable_pro}
                            onChange={(e) =>
                                handleSettingChange('perplexity', 'enable_pro', e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="perplexity-pro" className="ml-2 block text-sm text-gray-700">
                            Enable Pro features
                        </label>
                    </div>
                </div>
            </div>

            {/* Google Docs Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Google Docs Configuration</h3>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="gdocs-markdown"
                        checked={tools.google_docs.settings.enable_markdown}
                        onChange={(e) =>
                            handleSettingChange('google_docs', 'enable_markdown', e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="gdocs-markdown" className="ml-2 block text-sm text-gray-700">
                        Enable Markdown support
                    </label>
                </div>
            </div>

            {/* Tool Usage Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tool Usage</h3>
                <div className="space-y-6">
                    {(Object.keys(tools) as Array<keyof ToolSettings>).map((tool) => (
                        <div key={tool} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 capitalize">
                                    {tool.replace('_', ' ')} Usage
                                </label>
                                {tools[tool].used_for.length === 0 && (
                                    <span className="text-sm text-red-600">* Required</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder={`Add ${tool} usage...`}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUsageChange(tool, (e.target as HTMLInputElement).value);
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }}
                                    className={`block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${tools[tool].used_for.length === 0
                                            ? 'border-red-300'
                                            : 'border-gray-300'
                                        }`}
                                />
                            </div>
                            {tools[tool].used_for.length === 0 && (
                                <p className="mt-1 text-sm text-red-600">
                                    Add at least one usage purpose for this tool
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tools[tool].used_for.map((usage, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                                    >
                                        {usage}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveUsage(tool, index)}
                                            className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                                        >
                                            <span className="sr-only">Remove usage</span>
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 