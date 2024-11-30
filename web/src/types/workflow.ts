export type Parameter = {
    name: string;
    description: string;
    example: string;
};

export type ToolSettingValue = boolean | null | string;

export type ToolSettings = Record<string, ToolSettingValue>;

export type Tool = {
    id: string;
    name: string;
    model: string;
    settings: ToolSettings;
};

export type WorkflowStep = {
    id: string;
    name: string;
    tool: Tool;
    description: string;
    input_source?: string;
    tool_usage?: string;
    prompt?: string;
    output_handling?: string;
    notes?: string;
};

export type Example = {
    parameters: Record<string, string>;
    sample_queries: string[];
};

export type Recipe = {
    name: string;
    description: string;
    author: string;
    path: string;
    tags: string[];
    parameters: Parameter[];
    workflow: WorkflowStep[];
    tips: string[];
    examples: Example[];
}; 