import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    flowchart: {
        curve: 'basis',
        padding: 20
    }
});

interface MermaidViewerProps {
    chart: string;
    className?: string;
}

const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, className = '' }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderChart = async () => {
            if (containerRef.current) {
                // Clear previous content
                containerRef.current.innerHTML = '';
                try {
                    const { svg } = await mermaid.render('mermaid-svg', chart);
                    containerRef.current.innerHTML = svg;
                } catch (error) {
                    console.error('Mermaid rendering error:', error);
                    containerRef.current.innerHTML = '<div class="text-red-500">Error rendering workflow diagram</div>';
                }
            }
        };

        renderChart();
    }, [chart]);

    return (
        <div
            ref={containerRef}
            className={`mermaid-viewer overflow-x-auto ${className}`}
        />
    );
};

export default MermaidViewer;