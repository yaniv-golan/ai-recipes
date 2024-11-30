import React, { useState } from 'react';
import { WorkflowStep, Tool } from '../types/workflow';
import { ToolsForm } from './ToolsForm';
import { TOOL_CONFIGS } from '../utils/tools';
import { validateStepReferences } from '../utils/stepReferences';

type WorkflowStepsFormProps = {
    steps: WorkflowStep[];
    onChange: (steps: WorkflowStep[]) => void;
};

export function WorkflowStepsForm({ steps, onChange }: WorkflowStepsFormProps) {
    const [draggedStep, setDraggedStep] = useState<number | null>(null);

    const sanitizeId = (name: string): string => {
        return name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .replace(/_+/g, '_');
    };

    const updateStep = (index: number, field: keyof WorkflowStep, value: any) => {
        const updatedSteps = steps.map((step, i) => {
            if (i === index) {
                if (field === 'tool' && typeof value === 'object' && 'name' in value) {
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

    const handleNameBlur = (index: number, name: string) => {
        const step = steps[index];
        const isTimestampId = /^step-\d+$/.test(step.id);
        if (step.id === '' || step.id === sanitizeId(step.name) || isTimestampId) {
            const updatedSteps = [...steps];
            updatedSteps[index] = { ...step, id: sanitizeId(name) };
            onChange(updatedSteps);
        }
    };

    const addStep = () => {
        const newStep: WorkflowStep = {
            id: '',
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

    const renderTextArea = (
        index: number,
        field: Exclude<keyof WorkflowStep, 'id' | 'name' | 'tool'>,
        label: string,
        placeholder: string,
        required: boolean = false,
        rows: number = 2
    ) => {
        const step = steps[index];
        const value = step[field] || '';

        // Only validate text fields that can contain step references
        const shouldValidateRefs = ['description', 'input_source', 'tool_usage', 'output_handling', 'notes'].includes(field);
        const validation = shouldValidateRefs && typeof value === 'string'
            ? validateStepReferences(value, steps)
            : { isValid: true, invalidRefs: [] };

        return (
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                        {required && <span className="text-red-600 ml-1">*</span>}
                    </label>
                    {required && !String(value).trim() && (
                        <span className="text-sm text-red-600">Required</span>
                    )}
                </div>
                <textarea
                    value={String(value)}
                    onChange={(e) => updateStep(index, field, e.target.value)}
                    rows={rows}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!validation.isValid ? 'border-red-300' :
                        !String(value).trim() && required ? 'border-red-300' : 'border-gray-300'
                        }`}
                    placeholder={placeholder}
                    required={required}
                />
                {!validation.isValid && (
                    <div className="mt-1 text-sm text-red-600">
                        Invalid step references: {validation.invalidRefs.map(ref => `#${ref}`).join(', ')}
                    </div>
                )}
            </div>
        );
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
                            key={step.id || index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={() => setDraggedStep(null)}
                            className="bg-white rounded-lg shadow p-4 cursor-move relative"
                        >
                            <button
                                type="button"
                                onClick={() => removeStep(index)}
                                className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                            >
                                <span className="sr-only">Remove step</span>
                                ×
                            </button>

                            <div className="grid grid-cols-2 gap-4 pr-8">
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
                                        onBlur={(e) => handleNameBlur(index, e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!step.name.trim() ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="Name this step"
                                        required
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Step ID
                                            <span className="text-red-600 ml-1">*</span>
                                        </label>
                                        {!String(step.id).trim() && (
                                            <span className="text-sm text-red-600">Required</span>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={step.id}
                                        onChange={(e) => updateStep(index, 'id', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!String(step.id).trim() ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="step_id"
                                        required
                                    />
                                </div>
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

                            {step.tool.name && (
                                <div className="mt-4">
                                    <ToolsForm
                                        tool={step.tool}
                                        onChange={(tool) => updateStep(index, 'tool', tool)}
                                    />
                                </div>
                            )}

                            {renderTextArea(
                                index,
                                'description',
                                'Description',
                                'Describe what this step does (use #step_id to reference other steps)',
                                true
                            )}

                            {renderTextArea(
                                index,
                                'input_source',
                                'Input Source',
                                "Describe where the input comes from (e.g., 'Output from #step_id')"
                            )}

                            {renderTextArea(
                                index,
                                'tool_usage',
                                'Tool Usage',
                                'Describe how the tool should be used (use #step_id to reference other steps)',
                                true
                            )}

                            {TOOL_CONFIGS[step.tool.id]?.requiredFields?.includes('prompt') && (
                                renderTextArea(
                                    index,
                                    'prompt',
                                    'Prompt',
                                    'Enter the prompt for this step',
                                    true,
                                    3
                                )
                            )}

                            {renderTextArea(
                                index,
                                'output_handling',
                                'Output Handling',
                                "Describe how to handle the output (e.g., 'Save for use in #step_id')"
                            )}

                            {renderTextArea(
                                index,
                                'notes',
                                'Notes',
                                'Additional notes about this step (use #step_id to reference other steps)'
                            )}
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