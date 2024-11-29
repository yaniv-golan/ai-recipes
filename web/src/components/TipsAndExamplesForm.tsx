import React, { useState } from 'react';
import { Parameter } from '../types/workflow';

type Example = {
    parameters: Record<string, string>;
    sample_queries?: string[];
};

type TipsAndExamplesFormProps = {
    tips: string[];
    examples: Example[];
    parameters: Parameter[];
    onTipsChange: (tips: string[]) => void;
    onExamplesChange: (examples: Example[]) => void;
};

export function TipsAndExamplesForm({
    tips,
    examples,
    parameters,
    onTipsChange,
    onExamplesChange,
}: TipsAndExamplesFormProps) {
    const [newTip, setNewTip] = useState('');
    const [newQuery, setNewQuery] = useState('');

    const addTip = () => {
        if (newTip.trim()) {
            onTipsChange([...tips, newTip.trim()]);
            setNewTip('');
        }
    };

    const removeTip = (index: number) => {
        onTipsChange(tips.filter((_, i) => i !== index));
    };

    const addExample = () => {
        const newExample: Example = {
            parameters: parameters.reduce((acc, param) => ({
                ...acc,
                [param.name]: '',
            }), {}),
            sample_queries: [],
        };
        onExamplesChange([...examples, newExample]);
    };

    const removeExample = (index: number) => {
        onExamplesChange(examples.filter((_, i) => i !== index));
    };

    const updateExampleParameter = (exampleIndex: number, paramName: string, value: string) => {
        const updatedExamples = examples.map((example, i) => {
            if (i === exampleIndex) {
                return {
                    ...example,
                    parameters: {
                        ...example.parameters,
                        [paramName]: value,
                    },
                };
            }
            return example;
        });
        onExamplesChange(updatedExamples);
    };

    const addQueryToExample = (exampleIndex: number) => {
        if (newQuery.trim()) {
            const updatedExamples = examples.map((example, i) => {
                if (i === exampleIndex) {
                    return {
                        ...example,
                        sample_queries: [...(example.sample_queries || []), newQuery.trim()],
                    };
                }
                return example;
            });
            onExamplesChange(updatedExamples);
            setNewQuery('');
        }
    };

    const removeQueryFromExample = (exampleIndex: number, queryIndex: number) => {
        const updatedExamples = examples.map((example, i) => {
            if (i === exampleIndex && example.sample_queries) {
                return {
                    ...example,
                    sample_queries: example.sample_queries.filter((_, qi) => qi !== queryIndex),
                };
            }
            return example;
        });
        onExamplesChange(updatedExamples);
    };

    return (
        <div className="space-y-8">
            {/* Tips Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-900">Tips</h3>
                        {tips.length === 0 && (
                            <span className="text-sm text-red-600">* At least one tip required</span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={addTip}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Add Tip
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTip}
                            onChange={(e) => setNewTip(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    addTip();
                                }
                            }}
                            className={`block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${tips.length === 0 ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter a tip..."
                        />
                    </div>

                    {tips.length === 0 && (
                        <p className="text-sm text-red-600">
                            Add at least one tip to help users with this workflow
                        </p>
                    )}

                    {tips.map((tip, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-50 p-3 rounded-md"
                        >
                            <span className="flex-grow">{tip}</span>
                            <button
                                type="button"
                                onClick={() => removeTip(index)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="sr-only">Remove tip</span>
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Examples Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Examples (Optional)</h3>
                    <button
                        type="button"
                        onClick={addExample}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Add Example
                    </button>
                </div>

                {examples.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No examples added yet. Click "Add Example" to start.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {examples.map((example, exampleIndex) => (
                            <div
                                key={exampleIndex}
                                className="bg-gray-50 rounded-lg p-4 relative"
                            >
                                <button
                                    type="button"
                                    onClick={() => removeExample(exampleIndex)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                >
                                    <span className="sr-only">Remove example</span>
                                    ×
                                </button>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Example {exampleIndex + 1}</h4>

                                    {/* Parameters */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {parameters.map((param) => (
                                            <div key={param.name}>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    {param.name}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={example.parameters[param.name] || ''}
                                                    onChange={(e) =>
                                                        updateExampleParameter(exampleIndex, param.name, e.target.value)
                                                    }
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    placeholder={`Example value for ${param.name}`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Sample Queries */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Sample Queries
                                        </label>
                                        <div className="mt-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={newQuery}
                                                onChange={(e) => setNewQuery(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        addQueryToExample(exampleIndex);
                                                    }
                                                }}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Add a sample query..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addQueryToExample(exampleIndex)}
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        <div className="mt-2 space-y-2">
                                            {example.sample_queries?.map((query, queryIndex) => (
                                                <div
                                                    key={queryIndex}
                                                    className="flex items-center gap-2 bg-white p-2 rounded-md"
                                                >
                                                    <span className="flex-grow font-mono text-sm">{query}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQueryFromExample(exampleIndex, queryIndex)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <span className="sr-only">Remove query</span>
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 