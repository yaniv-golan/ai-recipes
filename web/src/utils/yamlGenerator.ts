import { dump } from 'js-yaml';
import { Parameter, WorkflowStep, Example, ToolSettings } from '../types/workflow';

type WorkflowData = {
    metadata: {
        name: string;
        description: string;
        tags: string[];
    };
    parameters: Parameter[];
    tools?: ToolSettings;
    workflow: WorkflowStep[];
    tips: string[];
    examples: Example[];
};

export function generateYaml(data: WorkflowData): string {
    // Transform the data to match the schema format
    const yamlData = {
        name: data.metadata.name,
        description: data.metadata.description,
        tags: data.metadata.tags,
        parameters: data.parameters.map(param => ({
            name: param.name,
            description: param.description,
            example: param.example,
        })),
        workflow: data.workflow.map(step => ({
            id: step.id,
            name: step.name,
            tool: {
                name: step.tool.name,
                model: step.tool.model,
                settings: step.tool.settings,
            },
            tool_usage: step.tool_usage,
            description: step.description,
            prompt: step.prompt,
            output_handling: step.output_handling,
            notes: step.notes,
        })),
        tips: data.tips,
        examples: data.examples.map(example => ({
            parameters: example.parameters,
            sample_queries: example.sample_queries,
        })),
    };

    // Convert to YAML with 2-space indentation
    return dump(yamlData, {
        indent: 2,
        lineWidth: -1, // Prevent line wrapping
        quotingType: '"',
        noRefs: true, // Prevent aliases for duplicate objects
    });
} 