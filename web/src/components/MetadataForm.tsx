import React, { useState } from 'react';

interface MetadataFormProps {
    data: {
        name: string;
        description: string;
        tags: string[];
    };
    onChange: (data: any) => void;
}

// 15 most common tags from existing recipes
const COMMON_TAGS = [
    "market-research",
    "competitive-intelligence",
    "data-synthesis",
    "research-workflow",
    "market-analysis",
    "competitor-analysis",
    "strategic-analysis",
    "research",
    "academic",
    "pdf",
    "summarization",
    "data-gathering",
    "report-generation",
    "analysis",
    "documentation"
];

export function MetadataForm({ data, onChange }: MetadataFormProps) {
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            const newTags = [...data.tags, tagInput.trim()];
            onChange({ ...data, tags: newTags });
            setTagInput('');
        }
    };

    const handleSelectCommonTag = (tag: string) => {
        if (!data.tags.includes(tag)) {
            const newTags = [...data.tags, tag];
            onChange({ ...data, tags: newTags });
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = data.tags.filter(tag => tag !== tagToRemove);
        onChange({ ...data, tags: newTags });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    {!data.name.trim() && (
                        <span className="text-sm text-red-600">* Required</span>
                    )}
                </div>
                <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => onChange({ ...data, name: e.target.value })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!data.name.trim() ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Workflow Name"
                    pattern="^[a-zA-Z0-9-]+$"
                    required
                />
                <p className="mt-1 text-sm text-gray-500">
                    Name your workflow
                </p>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => onChange({ ...data, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows={3}
                    placeholder="Describe your workflow"
                />
            </div>

            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags
                </label>
                <div className="mt-1 flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            id="tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="block w-64 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border-gray-300"
                            placeholder="Add a tag"
                            pattern="^[a-zA-Z0-9-]+$"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                                >
                                    <span className="sr-only">Remove tag</span>
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md">
                        {COMMON_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => handleSelectCommonTag(tag)}
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium 
                                    ${data.tags.includes(tag)
                                        ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                disabled={data.tags.includes(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Press Enter or click Add to add a custom tag, or click a common tag to select it
                </p>
            </div>
        </div>
    );
} 