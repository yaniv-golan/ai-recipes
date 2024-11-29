import React, { useState } from 'react';
import { WorkflowStep, Tool } from '../types/workflow';
import { ToolsForm } from './ToolsForm';
import { TOOL_CONFIGS, ToolConfig } from '../utils/tools';

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
                id: '',
                name: '',
                model: '',
                settings: {}
            },
            description: '',
            tool_usage: '',
            prompt: '',
            output_handling: '',
            notes: ''
        };
        onChange([...steps, newStep]);
    };

    const updateStep = (index: number, field: keyof WorkflowStep, value: any) => {
        const updatedSteps = steps.map((step, i) => {
            if (i === index) {
                if (field === 'tool' && 'name' in value) {
                    // When tool is selected, initialize it with the config
                    const toolConfig = TOOL_CONFIGS[value.name];
                    if (toolConfig) {
                        value = {
                            ...value,
                            id: toolConfig.id,
                            description: toolConfig.description
                        };
                    }
                }
                return { ...step, [field]: value };
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
                                            Step Name
                                            <span className="text-red-600 ml-1">*</span>
                                        </label>
                                        {!step.name.trim() && (
                                            <span className="text-sm text-red-600">Required</span>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={step.name}
                                        onChange={(e) => updateStep(index, 'name', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!step.name.trim() ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="Name this step"
                                        required
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Tool
                                            <span className="text-red-600 ml-1">*</span>
                                        </label>
                                        {!step.tool.name && (
                                            <span className="text-sm text-red-600">Required</span>
                                        )}
                                    </div>
                                    <select
                                        value={step.tool.id}
                                        onChange={(e) => {
                                            const toolId = e.target.value;
                                            const toolConfig = TOOL_CONFIGS[toolId];
                                            updateStep(index, 'tool', {
                                                id: toolId,
                                                name: toolConfig?.name || '',
                                                model: '',
                                                settings: {}
                                            });
                                        }}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!step.tool.id ? 'border-red-300' : 'border-gray-300'}`}
                                        required
                                    >
                                        <option value="">Select a tool</option>
                                        {Object.keys(TOOL_CONFIGS).map(id => (
                                            <option key={id} value={id}>
                                                {TOOL_CONFIGS[id].name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {step.tool.name && (
                                <div className="mt-4">
                                    <ToolsForm
                                        tool={step.tool}
                                        onChange={(tool) => updateStep(index, 'tool', tool)}
                                    />
                                </div>
                            )}

                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                        <span className="text-red-600 ml-1">*</span>
                                    </label>
                                    {!step.description.trim() && (
                                        <span className="text-sm text-red-600">Required</span>
                                    )}
                                </div>
                                <textarea
                                    value={step.description}
                                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                                    rows={2}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!step.description.trim() ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="Describe what this step does"
                                    required
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tool Usage
                                </label>
                                <textarea
                                    value={step.tool_usage}
                                    onChange={(e) => updateStep(index, 'tool_usage', e.target.value)}
                                    rows={2}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Describe how the tool should be used (optional)"
                                />
                            </div>

                            {TOOL_CONFIGS[step.tool.id]?.requiredFields?.includes('prompt') && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Prompt
                                        <span className="text-red-600 ml-1">*</span>
                                    </label>
                                    <textarea
                                        value={step.prompt}
                                        onChange={(e) => updateStep(index, 'prompt', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Enter the prompt for this step"
                                        required
                                    />
                                </div>
                            )}

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Output Handling
                                </label>
                                <textarea
                                    value={step.output_handling}
                                    onChange={(e) => updateStep(index, 'output_handling', e.target.value)}
                                    rows={2}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Describe how to handle the output (optional)"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Notes
                                </label>
                                <textarea
                                    value={step.notes}
                                    onChange={(e) => updateStep(index, 'notes', e.target.value)}
                                    rows={2}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Additional notes about this step (optional)"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addStep}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Add Step
                    </button>
                </div>
            )}
        </div>
    );
} 