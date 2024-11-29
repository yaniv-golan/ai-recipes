import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    flowchart: {
        htmlLabels: true,
        curve: 'linear',
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 50
    }
});

interface MermaidViewerProps {
    chart: string;
    className?: string;
}

const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, className = '' }) => {
    const elementId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        const renderDiagram = async () => {
            try {
                const element = document.getElementById(elementId.current);
                if (!element) return;

                // First clear the element
                element.innerHTML = '';

                // Create a new div with the mermaid class
                const diagramDiv = document.createElement('div');
                diagramDiv.className = 'mermaid';
                diagramDiv.textContent = chart;
                element.appendChild(diagramDiv);

                // Render the diagram
                await mermaid.init(undefined, '.mermaid');
            } catch (error) {
                console.error('Mermaid rendering error:', error);
                const element = document.getElementById(elementId.current);
                if (element) {
                    element.innerHTML = `
                        <div class="text-red-500 p-4">
                            Error rendering workflow diagram
                            <pre class="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">${chart}</pre>
                        </div>
                    `;
                }
            }
        };

        renderDiagram();
    }, [chart]);

    return (
        <div
            id={elementId.current}
            className={className}
        />
    );
};

export default MermaidViewer;