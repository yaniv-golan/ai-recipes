# Writing Tool Usage Instructions

This guide explains how to write effective `tool_usage` instructions in recipe steps. Good tool usage instructions are critical for users to successfully execute each step of a workflow.

## General Principles

1. **Be Specific and Actionable**
   - Each instruction should be a concrete action
   - Use clear, imperative verbs
   - Avoid vague or ambiguous language

2. **Use Numbered Steps**
   - Main steps should be numbered (1, 2, 3...)
   - Sub-steps should use letters (a, b, c...)
   - Keep the hierarchy to maximum two levels

3. **Include UI Elements**
   - Mention specific buttons, e.g., "Click 'Copy' button"
   - Reference exact menu items, e.g., "Select 'Export as PDF'"
   - Use quotes for UI text

4. **Provide Context**
   - Start with a context line if needed
   - Reference input from previous steps using #step_id
   - Indicate what to expect

## Step References

Steps can reference other steps using the `#step_id` syntax. This makes workflows easier to understand and maintain.

### When to Use References

1. **Input Sources**
   - Specify where data comes from
   - Reference files or outputs from previous steps
   - Indicate data dependencies

2. **Tool Usage Instructions**
   - Reference specific steps when describing actions
   - Make data flow explicit
   - Provide clear context

3. **Output Handling**
   - Specify where output should go
   - Reference next steps that will use the output
   - Describe any required formatting

4. **Notes and Context**
   - Add references to related steps
   - Explain dependencies
   - Provide workflow context

### Best Practices

1. **Clear Dependencies**
   - Use step references to make data flow explicit
   - Reference steps by their ID, not just their number
   - Include context about what's being passed

2. **Readable References**
   - Add descriptive text around references
   - Specify the type of data being referenced
   - Use complete sentences

3. **Valid References**
   - Only reference existing step IDs
   - Avoid circular dependencies
   - Keep references forward-looking when possible

### Examples

```yaml
# Good - Clear references with context
input_source: "Query results from #generate_queries"
tool_usage: |
  1. Take the analysis from #data_collection
  2. Review each section...
output_handling: "Save report for use in #final_analysis"

# Bad - Vague references without context
input_source: "#previous_step"
tool_usage: |
  1. Use #step1
  2. Do analysis...
output_handling: "Save for #next"
```

## Format

```yaml
tool_usage: |
  [Context line if needed]
  1. [First main step]
     a. [Sub-step if needed]
     b. [Sub-step if needed]
  2. [Second main step]
  3. [Third main step]
```

## Examples

### Good Example (AI Tool)

```yaml
tool_usage: |
  1. Create a new conversation with Claude
  2. Use the provided prompt template
  3. Wait for complete response
  4. Review output for accuracy
  5. Copy the final response
```

### Good Example (Document Tool)

```yaml
tool_usage: |
  1. Create new Google Doc titled "[Date] - Analysis"
  2. Set document format:
     a. Title: Heading 1
     b. Sections: Heading 2
     c. Body: Normal text
  3. Add content sections:
     a. Paste query text
     b. Press Enter twice
     c. Paste response
```

### Bad Example (Too Vague)

```yaml
tool_usage: |
  Use Claude to analyze the data
  Put results in doc
  Make it look nice
```

## Best Practices

1. **Completeness**
   - Include all necessary steps
   - Don't assume user knowledge
   - Mention both input and output handling

2. **Clarity**
   - Use consistent terminology
   - Keep instructions concise
   - One action per step

3. **User Interface**
   - Reference specific UI elements
   - Include keyboard shortcuts if relevant
   - Mention confirmation dialogs or prompts

4. **Error Prevention**
   - Warn about common pitfalls
   - Include verification steps
   - Add notes about expected behavior

## Tool-Specific Guidelines

### AI Tools (Claude, ChatGPT, Perplexity)

- Mention conversation/session creation
- Reference prompt templates
- Include waiting and review steps
- Specify how to handle the output

### Document Tools (Google Docs)

- Include document naming conventions
- Specify formatting settings
- Detail content organization
- Mention save/export steps

### Integration Steps

- Specify how data moves between tools
- Include copy/paste instructions
- Mention file format requirements
- Detail any conversion steps

## Notes Guidelines

The `notes` field in recipe steps provides additional context, warnings, or tips that don't fit in the step-by-step instructions. Notes are displayed as plain text without formatting.

### When to Use Notes

1. **Prerequisites**
   - Dependencies that must be installed
   - Required API keys or credentials
   - Necessary permissions or settings

2. **Warnings**
   - Common pitfalls to avoid
   - Rate limits or quotas
   - Potential compatibility issues

3. **Tips**
   - Performance optimizations
   - Alternative approaches
   - Best practices

4. **Context**
   - Background information
   - Related documentation links
   - Explanations of complex concepts

### Best Practices

1. **Keep it Concise**
   - Use short, clear sentences
   - Focus on essential information
   - Avoid redundant details

2. **Be Specific**
   - Reference exact versions
   - Include specific error messages
   - Mention relevant limitations

3. **Stay Relevant**
   - Only include notes that help with the current step
   - Don't duplicate information from tool_usage
   - Focus on practical, actionable information

### Example Notes

```yaml
notes: |
  API key must have 'read_analytics' permission
  Rate limit: 100 requests per minute
  For large datasets, consider using batch processing
```

```yaml
notes: |
  Chrome extension must be installed and enabled
  Screenshots are saved in PNG format
  Use incognito mode to avoid cached data
```

## Writing Prompts

The `prompt` field in recipe steps defines the template for interacting with AI tools. Prompts can include dynamic parameters using the `{{parameter_name}}` syntax.

### Parameter Syntax

1. **Basic Format**
   - Use double curly braces: `{{parameter_name}}`
   - Parameter names must:
     - Start with a letter
     - Contain only letters, numbers, and underscores
     - Match a parameter defined in recipe.yaml

2. **Parameter Display**
   - Parameters are highlighted in yellow in the UI
   - Undefined parameters show the placeholder: `{{parameter_name}}`
   - Defined parameters show their value: `value`

### Best Practices

1. **Clear Structure**
   - Use sections (Role, Context, Task, etc.)
   - Include formatting instructions
   - Specify output requirements

2. **Parameter Usage**
   - Place parameters in logical locations
   - Use descriptive parameter names
   - Add XML-style tags for clarity:

     ```
     <target_market>
     {{target_market}}
     </target_market>
     ```

3. **Formatting**
   - Use markdown for structure
   - Include line breaks for readability
   - Keep consistent indentation

### Example Prompt

```yaml
prompt: |
  **Role:** You are a market research specialist tasked with generating 5 specific search queries.

  **Target Market:**
  <market>
  {{target_market}}
  </market>

  **Requirements:**
  - Generate {{num_queries}} search queries
  - Focus on {{analysis_focus}}
  - Include data from {{time_period}}

  **Output Format:**
  - Number each query (1-5)
  - One query per line
  - Include market context
```

The prompt will be displayed in a monospace font with parameter highlighting, making it easy to identify dynamic elements.
