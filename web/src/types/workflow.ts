import { ToolSettings } from '../components/ToolsForm';

export type Parameter = {
    name: string;
    description: string;
    required: boolean;
    example: string;
};

export type WorkflowStep = {
    id: string;
    name: string;
    tool: {
        type: keyof ToolSettings;
        settings: {
            model?: 'GPT-4o' | 'GPT-4o with canvas' | 'o1-preview' | 'o1-mini';
            enable_web_search?: boolean;
            custom_gpt?: {
                name: string;
                url: string;
            } | null;
            focus?: 'Web' | 'Academic' | 'Math' | 'Writing' | 'Video' | 'Social';
            enable_pro?: boolean;
            enable_markdown?: boolean;
            enable_artifacts?: boolean;
            enable_analysis_tool?: boolean;
        };
        used_for: string[];
    };
    description: string;
    tool_usage: string;
    prompt: string;
    output_handling: string;
    notes: string;
};

export type Example = {
    parameters: Record<string, string>;
    sample_queries?: string[];
}; 