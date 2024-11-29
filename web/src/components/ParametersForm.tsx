import React from 'react';
import { Parameter } from '../types/workflow';

type ParametersFormProps = {
    parameters: Parameter[];
    onChange: (parameters: Parameter[]) => void;
};

export function ParametersForm({ parameters, onChange }: ParametersFormProps) {
    const addParameter = () => {
        onChange([
            ...parameters,
            { name: '', description: '', example: '' },
        ]);
    };

    const removeParameter = (index: number) => {
        onChange(parameters.filter((_, i) => i !== index));
    };

    const updateParameter = (index: number, field: keyof Parameter, value: string) => {
        const updatedParameters = parameters.map((param, i) => {
            if (i === index) {
                return { ...param, [field]: value };
            }
            return param;
        });
        onChange(updatedParameters);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Parameters</h2>
            </div>

            {parameters.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">No parameters added yet.</p>
                    <button
                        type="button"
                        onClick={addParameter}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Add First Parameter
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {parameters.map((param, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-4 relative"
                        >
                            <button
                                type="button"
                                onClick={() => removeParameter(index)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            >
                                <span className="sr-only">Remove parameter</span>
                                ×
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor={`param-name-${index}`}
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Name
                                            <span className="text-red-600 ml-1">*</span>
                                        </label>
                                        {!param.name.trim() && (
                                            <span className="text-sm text-red-600">Required</span>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        id={`param-name-${index}`}
                                        value={param.name}
                                        onChange={(e) => updateParameter(index, 'name', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!param.name.trim() ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="parameter_name"
                                        pattern="^[a-zA-Z][a-zA-Z0-9_]*$"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Must start with a letter and contain only letters, numbers, and underscores
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor={`param-example-${index}`}
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Example
                                            <span className="text-red-600 ml-1">*</span>
                                        </label>
                                        {!param.example.trim() && (
                                            <span className="text-sm text-red-600">Required</span>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        id={`param-example-${index}`}
                                        value={param.example}
                                        onChange={(e) => updateParameter(index, 'example', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!param.example.trim() ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="Example value"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor={`param-description-${index}`}
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Description
                                            <span className="text-red-600 ml-1">*</span>
                                        </label>
                                        {!param.description.trim() && (
                                            <span className="text-sm text-red-600">Required</span>
                                        )}
                                    </div>
                                    <textarea
                                        id={`param-description-${index}`}
                                        value={param.description}
                                        onChange={(e) => updateParameter(index, 'description', e.target.value)}
                                        rows={2}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!param.description.trim() ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="Describe what this parameter is used for..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addParameter}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Add Parameter
                    </button>
                </div>
            )}
        </div>
    );
} 