import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface RecipeCardProps {
    title: string;
    description: string;
    author: string;
    path: string;
    tags: string[];
    onTagClick: (tag: string) => void;
}

function truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

// Remove markdown formatting
function stripMarkdown(text: string): string {
    return text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/[*_~`]/g, '') // Remove emphasis markers
        .replace(/#+\s/g, '') // Remove headers
        .replace(/\n/g, ' ') // Replace newlines with spaces
        .trim();
}

export function RecipeCard({ title, description, author, path, tags, onTagClick }: RecipeCardProps) {
    const navigate = useNavigate();

    const handleTagClick = (tag: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (onTagClick) {
            onTagClick(tag);
        }
    };

    const cleanDescription = truncateText(stripMarkdown(description));

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <Link
                            to={`/recipe/${path}`}
                            className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                        >
                            {title}
                        </Link>
                    </div>
                    <Link
                        to={`/author/${author}`}
                        className="text-sm text-gray-600 hover:text-blue-600"
                    >
                        {author}
                    </Link>
                </div>
                <p className="mt-2 text-gray-600 text-sm line-clamp-2">{cleanDescription}</p>
                {tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => onTagClick(tag)}
                                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}