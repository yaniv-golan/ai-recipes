import React from 'react';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
    title: string;
    description: string;
    author: string;
    path: string;
    tags: string[];
}

export function RecipeCard({ title, description, author, path, tags }: RecipeCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>
            <p className="mt-2 text-gray-600">{description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">By {author}</span>
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