import { useState } from 'react';

type MetadataFormProps = {
    data: {
        name: string;
        description: string;
        tags: string[];
    };
    onChange: (data: { name: string; description: string; tags: string[] }) => void;
};

export function MetadataForm({ data, onChange }: MetadataFormProps) {
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            const newTags = [...data.tags, tagInput.trim()];
            onChange({ ...data, tags: newTags });
            setTagInput('');
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
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!data.name.trim() ? 'border-red-300' : 'border-gray-300'
                        }`}
                    placeholder="workflow-name"
                    pattern="^[a-zA-Z0-9-]+$"
                    required
                />
                <p className="mt-1 text-sm text-gray-500">
                    Only letters, numbers, and hyphens are allowed
                </p>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    {!data.description.trim() && (
                        <span className="text-sm text-red-600">* Required</span>
                    )}
                </div>
                <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => onChange({ ...data, description: e.target.value })}
                    rows={3}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!data.description.trim() ? 'border-red-300' : 'border-gray-300'
                        }`}
                    placeholder="A brief description of your workflow..."
                    maxLength={500}
                    required
                />
                <p className="mt-1 text-sm text-gray-500">
                    {data.description.length}/500 characters
                </p>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags
                    </label>
                    {data.tags.length === 0 && (
                        <span className="text-sm text-red-600">* Required</span>
                    )}
                </div>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`block w-full rounded-l-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${data.tags.length === 0 ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Add a tag"
                        pattern="^[a-zA-Z0-9-]+$"
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 hover:bg-gray-100"
                    >
                        Add
                    </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Press Enter or click Add to add a tag
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
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
            </div>
        </div>
    );
} 