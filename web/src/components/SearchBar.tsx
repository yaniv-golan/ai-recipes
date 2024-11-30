import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    className?: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function SearchBar({
    className = '',
    value,
    onChange,
    disabled = false,
    placeholder = 'Search recipes...'
}: SearchBarProps) {
    return (
        <div className={`relative ${className}`}>
            <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${disabled ? 'text-gray-300' : 'text-gray-400'
                    }`}
            />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`
          w-full pl-10 pr-4 py-2 
          border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        `}
            />
        </div>
    );
}