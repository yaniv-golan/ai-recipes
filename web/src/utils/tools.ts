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

// Type guard for schema validation
function isValidSchema(data: unknown): data is { allOf: [any, { properties: ToolSchema['properties'], required?: string[] }] } {
    return (
        data !== null &&
        typeof data === 'object' &&
        'allOf' in data &&
        Array.isArray((data as any).allOf) &&
        (data as any).allOf.length === 2 &&
        typeof (data as any).allOf[1] === 'object' &&
        'properties' in (data as any).allOf[1]
    );
}

// Function to load tool schemas
async function loadToolSchemas() {
    const schemas: Record<string, { allOf: [any, { properties: ToolSchema['properties'], required?: string[] }] }> = {};
    const failedTools: string[] = [];

    try {
        const toolIds = Object.keys(toolConfigs).map(path => path.split('/').slice(-2)[0]);

        for (const toolId of toolIds) {
            try {
                const response = await fetch(`/ai-recipes/data/schemas/${toolId}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (!isValidSchema(data)) {
                    throw new Error('Invalid schema structure');
                }

                schemas[toolId] = data;
            } catch (error) {
                failedTools.push(toolId);
                console.error(`Failed to load schema for tool ${toolId}:`, error instanceof Error ? error.message : String(error));

                // Fallback: Create a minimal valid schema structure
                schemas[toolId] = {
                    allOf: [
                        {},
                        {
                            properties: {},
                            required: []
                        }
                    ]
                };
            }
        }

        if (failedTools.length > 0) {
            console.warn('Some tool schemas failed to load:', failedTools);
        }
    } catch (error) {
        console.error('Critical error loading tool schemas:', error instanceof Error ? error.message : String(error));
        throw new Error('Failed to initialize tool schemas');
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