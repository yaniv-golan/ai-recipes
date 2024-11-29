import { dump } from 'js-yaml';
import { Parameter, WorkflowStep, Example } from '../types/workflow';
import { ToolSettings } from '../components/ToolsForm';

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
            required: param.required,
            example: param.example,
        })),
        tools: data.tools ? {
            chatgpt: {
                used_for: data.tools.chatgpt.used_for,
                settings: {
                    model: data.tools.chatgpt.settings.model,
                    enable_web_search: data.tools.chatgpt.settings.enable_web_search,
                    ...(data.tools.chatgpt.settings.custom_gpt && {
                        custom_gpt: data.tools.chatgpt.settings.custom_gpt,
                    }),
                },
            },
            claude: {
                used_for: data.tools.claude.used_for,
                settings: {
                    model: data.tools.claude.settings.model,
                    enable_artifacts: data.tools.claude.settings.enable_artifacts,
                    enable_analysis_tool: data.tools.claude.settings.enable_analysis_tool,
                },
            },
            perplexity: {
                used_for: data.tools.perplexity.used_for,
                settings: {
                    focus: data.tools.perplexity.settings.focus,
                    enable_pro: data.tools.perplexity.settings.enable_pro,
                },
            },
            google_docs: {
                used_for: data.tools.google_docs.used_for,
                settings: {
                    enable_markdown: data.tools.google_docs.settings.enable_markdown,
                },
            },
        } : {},
        workflow: data.workflow.map(step => ({
            id: step.id,
            name: step.name,
            tool: step.tool.type,
            tool_settings: step.tool.settings,
            tool_usage: step.tool_usage,
            description: step.description,
            prompt: step.prompt,
            output_handling: step.output_handling,
            notes: step.notes,
        })),
        tips: data.tips,
        examples: data.examples.map(example => ({
            parameters: example.parameters,
            ...(example.sample_queries && { sample_queries: example.sample_queries }),
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