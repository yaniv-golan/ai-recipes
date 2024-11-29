import React, { useState } from 'react';
import { ToolSettings } from './ToolsForm';

type WorkflowStep = {
    id: string;
    name: string;
    tool: {
        type: keyof ToolSettings;
        settings: {
            model?: 'GPT-4o' | 'GPT-4o with canvas' | 'o1-preview' | 'o1-mini';
            enable_web_search?: boolean;
            custom_gpt?: {
                name: string;
                url: string;
            } | null;
            focus?: 'Web' | 'Academic' | 'Math' | 'Writing' | 'Video' | 'Social';
            enable_pro?: boolean;
            enable_markdown?: boolean;
            enable_artifacts?: boolean;
            enable_analysis_tool?: boolean;
        };
        used_for: string[];
    };
    description: string;
    tool_usage: string;
    prompt: string;
    output_handling: string;
    notes: string;
};

type WorkflowStepsFormProps = {
    steps: WorkflowStep[];
    onChange: (steps: WorkflowStep[]) => void;
};

export function WorkflowStepsForm({ steps, onChange }: WorkflowStepsFormProps) {
    const [draggedStep, setDraggedStep] = useState<number | null>(null);

    const addStep = () => {
        const newStep: WorkflowStep = {
            id: `step-${Date.now()}`,
            name: '',
            tool: {
                type: 'chatgpt',
                settings: {
                    model: 'GPT-4o',
                    enable_web_search: false,
                    custom_gpt: null,
                },
                used_for: [],
            },
            description: '',
            tool_usage: '',
            prompt: '',
            output_handling: '',
            notes: '',
        };
        onChange([...steps, newStep]);
    };

    const updateStep = (index: number, field: keyof WorkflowStep, value: any) => {
        const updatedSteps = steps.map((step, i) => {
            if (i === index) {
                if (field === 'tool') {
                    // Reset tool settings when tool type changes
                    const newToolType = value as keyof ToolSettings;
                    let newSettings = {};
                    switch (newToolType) {
                        case 'chatgpt':
                            newSettings = {
                                model: 'GPT-4o',
                                enable_web_search: false,
                                custom_gpt: null,
                            };
                            break;
                        case 'claude':
                            newSettings = {
                                model: 'Claude 3.5 Sonnet',
                                enable_artifacts: false,
                                enable_analysis_tool: false,
                            };
                            break;
                        case 'perplexity':
                            newSettings = {
                                focus: 'Web',
                                enable_pro: false,
                            };
                            break;
                        case 'google_docs':
                            newSettings = {
                                enable_markdown: true,
                            };
                            break;
                    }
                    return {
                        ...step,
                        tool: {
                            type: newToolType,
                            settings: newSettings,
                            used_for: [],
                        },
                    };
                }
                return { ...step, [field]: value };
            }
            return step;
        });
        onChange(updatedSteps);
    };

    const updateToolSettings = (stepIndex: number, setting: string, value: any) => {
        const updatedSteps = steps.map((step, i) => {
            if (i === stepIndex) {
                return {
                    ...step,
                    tool: {
                        ...step.tool,
                        settings: {
                            ...step.tool.settings,
                            [setting]: value,
                        },
                    },
                };
            }
            return step;
        });
        onChange(updatedSteps);
    };

    const addToolUsage = (stepIndex: number, usage: string) => {
        if (usage.trim()) {
            const updatedSteps = steps.map((step, i) => {
                if (i === stepIndex) {
                    return {
                        ...step,
                        tool: {
                            ...step.tool,
                            used_for: [...step.tool.used_for, usage.trim()],
                        },
                    };
                }
                return step;
            });
            onChange(updatedSteps);
        }
    };

    const removeToolUsage = (stepIndex: number, usageIndex: number) => {
        const updatedSteps = steps.map((step, i) => {
            if (i === stepIndex) {
                return {
                    ...step,
                    tool: {
                        ...step.tool,
                        used_for: step.tool.used_for.filter((_, i) => i !== usageIndex),
                    },
                };
            }
            return step;
        });
        onChange(updatedSteps);
    };

    const removeStep = (index: number) => {
        onChange(steps.filter((_, i) => i !== index));
    };

    const handleDragStart = (index: number) => {
        setDraggedStep(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedStep === null || draggedStep === index) return;

        const newSteps = [...steps];
        const draggedItem = newSteps[draggedStep];
        newSteps.splice(draggedStep, 1);
        newSteps.splice(index, 0, draggedItem);
        onChange(newSteps);
        setDraggedStep(index);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Workflow Steps</h2>

            {steps.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">No steps added yet.</p>
                    <button
                        type="button"
                        onClick={addStep}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Add First Step
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={() => setDraggedStep(null)}
                            className="bg-white rounded-lg shadow p-4 cursor-move relative"
                        >
                            <button
                                type="button"
                                onClick={() => removeStep(index)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            >
                                <span className="sr-only">Remove step</span>
                                ×
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Step Name (Optional)
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={step.name}
                                        onChange={(e) => updateStep(index, 'name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Name this step"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Tool
                                        </label>
                                    </div>
                                    <select
                                        value={step.tool.type}
                                        onChange={(e) => updateStep(index, 'tool', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="chatgpt">ChatGPT</option>
                                        <option value="claude">Claude</option>
                                        <option value="perplexity">Perplexity</option>
                                        <option value="google_docs">Google Docs</option>
                                    </select>
                                </div>

                                {/* Tool-specific settings */}
                                <div className="col-span-2 space-y-4">
                                    {step.tool.type === 'chatgpt' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Model</label>
                                                <select
                                                    value={step.tool.settings.model}
                                                    onChange={(e) => updateToolSettings(index, 'model', e.target.value)}
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
                                                    checked={step.tool.settings.enable_web_search}
                                                    onChange={(e) =>
                                                        updateToolSettings(index, 'enable_web_search', e.target.checked)
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    Enable web search
                                                </label>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Custom GPT (optional)
                                                </label>
                                                <div className="mt-1 space-y-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Custom GPT Name"
                                                        value={step.tool.settings.custom_gpt?.name || ''}
                                                        onChange={(e) =>
                                                            updateToolSettings(index, 'custom_gpt', {
                                                                ...(step.tool.settings.custom_gpt || {}),
                                                                name: e.target.value,
                                                            })
                                                        }
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    />
                                                    <input
                                                        type="url"
                                                        placeholder="Custom GPT URL"
                                                        value={step.tool.settings.custom_gpt?.url || ''}
                                                        onChange={(e) =>
                                                            updateToolSettings(index, 'custom_gpt', {
                                                                ...(step.tool.settings.custom_gpt || {}),
                                                                url: e.target.value,
                                                            })
                                                        }
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {step.tool.type === 'claude' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Model</label>
                                                <select
                                                    value={step.tool.settings.model}
                                                    onChange={(e) => updateToolSettings(index, 'model', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                                                    <option value="Claude 3 Opus">Claude 3 Opus</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={step.tool.settings.enable_artifacts}
                                                    onChange={(e) =>
                                                        updateToolSettings(index, 'enable_artifacts', e.target.checked)
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    Enable artifacts
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={step.tool.settings.enable_analysis_tool}
                                                    onChange={(e) =>
                                                        updateToolSettings(index, 'enable_analysis_tool', e.target.checked)
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    Enable analysis tool
                                                </label>
                                            </div>
                                        </>
                                    )}

                                    {step.tool.type === 'perplexity' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Focus</label>
                                                <select
                                                    value={step.tool.settings.focus}
                                                    onChange={(e) => updateToolSettings(index, 'focus', e.target.value)}
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
                                                    checked={step.tool.settings.enable_pro}
                                                    onChange={(e) =>
                                                        updateToolSettings(index, 'enable_pro', e.target.checked)
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    Enable Pro features
                                                </label>
                                            </div>
                                        </>
                                    )}

                                    {step.tool.type === 'google_docs' && (
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={step.tool.settings.enable_markdown}
                                                onChange={(e) =>
                                                    updateToolSettings(index, 'enable_markdown', e.target.checked)
                                                }
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label className="ml-2 block text-sm text-gray-700">
                                                Enable Markdown support
                                            </label>
                                        </div>
                                    )}

                                    {/* Tool Usage */}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Tool Usage
                                            </label>
                                            {!step.tool_usage.trim() && (
                                                <span className="text-sm text-red-600">* Required</span>
                                            )}
                                        </div>
                                        <textarea
                                            value={step.tool_usage}
                                            onChange={(e) => updateStep(index, 'tool_usage', e.target.value)}
                                            rows={3}
                                            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!step.tool_usage.trim() ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Describe how to use the tool in this step"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Description (Optional)
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={step.description}
                                        onChange={(e) => updateStep(index, 'description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Describe what this step does"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Prompt Template (Optional)
                                        </label>
                                    </div>
                                    <textarea
                                        value={step.prompt}
                                        onChange={(e) => updateStep(index, 'prompt', e.target.value)}
                                        rows={5}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                                        placeholder="Enter the prompt template for this step"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Output Handling (Optional)
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={step.output_handling}
                                        onChange={(e) => updateStep(index, 'output_handling', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="How should the output be handled?"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Notes (Optional)
                                        </label>
                                    </div>
                                    <textarea
                                        value={step.notes}
                                        onChange={(e) => updateStep(index, 'notes', e.target.value)}
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Additional notes or tips for this step"
                                    />
                                </div>
                            </div>

                            <div className="mt-2 text-sm text-gray-500">
                                Drag to reorder • Step {index + 1}
                            </div>
                        </div>
                    ))}

                    {/* Add Step button at the end */}
                    <div className="flex justify-center pt-4">
                        <button
                            type="button"
                            onClick={addStep}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Add Next Step
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 