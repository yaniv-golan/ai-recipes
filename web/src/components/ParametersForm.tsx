import React from 'react';

type Parameter = {
    name: string;
    description: string;
    required: boolean;
    example: string;
};

type ParametersFormProps = {
    parameters: Parameter[];
    onChange: (parameters: Parameter[]) => void;
};

export function ParametersForm({ parameters, onChange }: ParametersFormProps) {
    const addParameter = () => {
        onChange([
            ...parameters,
            { name: '', description: '', required: false, example: '' },
        ]);
    };

    const removeParameter = (index: number) => {
        onChange(parameters.filter((_, i) => i !== index));
    };

    const updateParameter = (index: number, field: keyof Parameter, value: string | boolean) => {
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
                <button
                    type="button"
                    onClick={addParameter}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    Add Parameter
                </button>
            </div>

            {parameters.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No parameters added yet. Click "Add Parameter" to start.</p>
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
                                        </label>
                                        {!param.name.trim() && (
                                            <span className="text-sm text-red-600">* Required</span>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        id={`param-name-${index}`}
                                        value={param.name}
                                        onChange={(e) => updateParameter(index, 'name', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!param.name.trim() ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="parameter_name"
                                        pattern="^[a-zA-Z][a-zA-Z0-9_]*$"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Must start with a letter and contain only letters, numbers, and underscores
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor={`param-example-${index}`}
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Example (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id={`param-example-${index}`}
                                        value={param.example}
                                        onChange={(e) => updateParameter(index, 'example', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Example value"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor={`param-description-${index}`}
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Description
                                        </label>
                                        {!param.description.trim() && (
                                            <span className="text-sm text-red-600">* Required</span>
                                        )}
                                    </div>
                                    <textarea
                                        id={`param-description-${index}`}
                                        value={param.description}
                                        onChange={(e) => updateParameter(index, 'description', e.target.value)}
                                        rows={2}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!param.description.trim() ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Describe what this parameter is used for..."
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`param-required-${index}`}
                                            checked={param.required}
                                            onChange={(e) => updateParameter(index, 'required', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor={`param-required-${index}`}
                                            className="ml-2 block text-sm text-gray-700"
                                        >
                                            Required parameter
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 