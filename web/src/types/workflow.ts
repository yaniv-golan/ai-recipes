export type Parameter = {
    name: string;
    description: string;
    example: string;
};

export type ToolSettings = {
    [key: string]: boolean | null | string;
    enable_web_search?: boolean | null;
    focus?: 'Web' | 'Academic' | 'Math' | 'Writing' | 'Video' | 'Social';
    enable_pro?: boolean | null;
    enable_markdown?: boolean | null;
    enable_artifacts?: boolean | null;
    enable_analysis?: boolean | null;
    enable_latex?: boolean | null;
};

export type Tool = {
    id: string;
    name: string;
    model: string;
    settings: Partial<ToolSettings>;
};

export type WorkflowStep = {
    id: string;
    name: string;
    tool: Tool;
    description: string;
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
    tags: string[];
    parameters: Parameter[];
    workflow: WorkflowStep[];
    tips: string[];
    examples: Example[];
}; 