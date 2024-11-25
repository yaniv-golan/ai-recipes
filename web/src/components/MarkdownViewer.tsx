import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { marked } from 'marked';
import hljs from 'highlight.js';

interface MarkdownViewerProps {
    recipePath: string;
    className?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
    recipePath,
    className = ''
}) => {
    const [content, setContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                setIsLoading(true);
                // Construct the raw GitHub content URL
                const baseUrl = 'https://raw.githubusercontent.com/yaniv-golan/ai-recipes/main';
                const response = await fetch(`${baseUrl}/${recipePath}/README.md`);

                if (!response.ok) {
                    throw new Error('Failed to load recipe documentation');
                }

                const markdown = await response.text();
                setContent(markdown);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        if (recipePath) {
            fetchMarkdown();
        }
    }, [recipePath]);

    // Configure marked options
    marked.setOptions({
        gfm: true,
        breaks: true,
        highlight: (code: string, language: string) => {
            if (language && hljs.getLanguage(language)) {
                try {
                    return hljs.highlight(code, { language }).value;
                } catch (err) {
                    console.error('Highlight.js error:', err);
                }
            }
            return code;
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive" className="my-4">
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className={`prose prose-slate max-w-none ${className}`}>
            <div
                className="markdown-content"
                dangerouslySetInnerHTML={{
                    __html: marked(content)
                }}
            />
        </div>
    );
};

export default MarkdownViewer;