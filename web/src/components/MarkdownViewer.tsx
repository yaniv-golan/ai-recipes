import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
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

    // Create marked instance with highlight extension
    const marked = new Marked(
        markedHighlight({
            langPrefix: 'hljs language-',
            highlight(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (err) {
                        console.error('Highlight.js error:', err);
                    }
                }
                return code;
            }
        })
    );

    marked.setOptions({
        gfm: true,
        breaks: true
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
                    __html: marked.parse(content)
                }}
            />
        </div>
    );
};

export default MarkdownViewer;