import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface RecipeCardProps {
    title: string;
    description: string;
    author: string;
    path: string;
    tags: string[];
    onTagClick?: (tag: string) => void;
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
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <Link to={`/recipe/${path}`} className="block">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600">{title}</h2>
                </div>
                <p className="mt-2 text-gray-600 hover:text-gray-900">{cleanDescription}</p>
            </Link>
            <div className="mt-4 flex flex-wrap gap-2">
                {tags.map(tag => (
                    <button
                        key={tag}
                        onClick={(e) => handleTagClick(tag, e)}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors cursor-pointer"
                    >
                        {tag}
                    </button>
                ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
                <Link
                    to={`/author/${author}`}
                    className="text-sm text-gray-500 hover:text-indigo-600"
                >
                    By {author}
                </Link>
                <Link
                    to={`/recipe/${path}`}
                    className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
                >
                    View Recipe →
                </Link>
            </div>
        </div>
    );
}