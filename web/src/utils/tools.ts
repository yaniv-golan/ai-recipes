import { ToolSettings } from '../types/workflow';

export type ToolSchema = {
    properties: {
        model?: {
            enum?: string[];
        };
        settings?: {
            properties: Record<string, {
                type: string;
                description: string;
                enum?: string[];
            }>;
        };
    };
    required?: string[];
};

export type ToolConfig = {
    id: string;
    name: string;
    description: string;
    icon: string;
    models?: string[];
    availableSettings?: Record<keyof ToolSettings, string>;
    requiredFields?: string[];
};

// Import all tool.yaml files
const toolConfigs = import.meta.glob<ToolConfig>('../../../tools/*/tool.yaml', {
    eager: true,
    import: 'default'
});

// Function to load tool schemas
async function loadToolSchemas() {
    const schemas: Record<string, { allOf: [any, { properties: ToolSchema['properties'], required?: string[] }] }> = {};

    try {
        // Load individual tool schemas
        const toolIds = Object.keys(toolConfigs).map(path => path.split('/').slice(-2)[0]);

        for (const toolId of toolIds) {
            try {
                const response = await fetch(`/ai-recipes/data/schemas/${toolId}.json`);
                if (response.ok) {
                    schemas[toolId] = await response.json();
                }
            } catch (error) {
                console.warn(`Failed to load schema for tool ${toolId}:`, error);
            }
        }
    } catch (error) {
        console.error('Failed to load tool schemas:', error);
    }

    return schemas;
}

// Initialize tool configs with basic info first
export const TOOL_CONFIGS = Object.fromEntries(
    Object.entries(toolConfigs).map(([path, config]) => {
        const toolId = path.split('/').slice(-2)[0];
        return [
            toolId,
            {
                ...config,
                id: toolId,
                icon: `/ai-recipes/data/tools/${toolId}/${config.icon}`,
                availableSettings: {}
            }
        ];
    })
);

// Load schemas and update tool configs
loadToolSchemas().then(schemas => {
    Object.entries(schemas).forEach(([toolId, schema]) => {
        if (TOOL_CONFIGS[toolId]) {
            const schemaProps = schema.allOf[1].properties;
            const updatedConfig = {
                ...TOOL_CONFIGS[toolId],
                availableSettings: schemaProps?.settings?.properties
                    ? Object.fromEntries(
                        Object.entries(schemaProps.settings.properties).map(([key, value]) => [
                            key,
                            value.description
                        ])
                    )
                    : {},
                requiredFields: schema.allOf[1].required || []
            };

            // Only add models if they exist in the schema
            if (schemaProps?.model?.enum) {
                updatedConfig.models = schemaProps.model.enum;
            }

            TOOL_CONFIGS[toolId] = updatedConfig;
        }
    });
});