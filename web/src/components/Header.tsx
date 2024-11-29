import React from 'react';
import { Link } from 'react-router-dom';
import { GitPullRequest, Plus } from 'lucide-react';

export function Header() {
    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-gray-900">
                        AI Recipe Hub
                    </Link>
                    <div className="flex gap-4">
                        <Link
                            to="/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Recipe
                        </Link>
                        <a
                            href="https://github.com/yaniv-golan/ai-recipes"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GitPullRequest className="h-5 w-5 mr-2" />
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}