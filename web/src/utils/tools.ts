import { Tool } from '../types/workflow';

export type ToolConfig = {
    id: string;
    name: string;
    description: string;
    icon: string;
    models?: string[];
    availableSettings?: Record<string, string>;
};

// Import all tool.yaml files from the public directory
const toolConfigs = import.meta.glob<ToolConfig>('../../../tools/*/tool.yaml', {
    eager: true,
    import: 'default'
});

console.log('Raw tool configs:', toolConfigs);

// Convert the imported configs into our format
export const TOOL_CONFIGS = Object.fromEntries(
    Object.entries(toolConfigs).map(([path, config]) => {
        const toolId = path.split('/').slice(-2)[0]; // Get the tool directory name
        console.log('Processing tool:', { path, toolId, config });
        return [
            toolId,
            {
                ...config,
                id: toolId,
                icon: `/ai-recipes/data/tools/${toolId}/${config.icon}`
            }
        ];
    })
);

// Debug: Log the loaded configurations
console.log('Final tool configs:', TOOL_CONFIGS);