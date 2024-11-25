# Market Analysis Recipe

> "When I needed to analyze the US smart home security market, this approach cut my research time from days to hours." - Sarah

A systematic approach to market analysis that combines multiple AI tools to efficiently gather and synthesize market research. This recipe uses Claude for query generation, Perplexity for research, and ChatGPT for synthesis to create comprehensive market analysis reports.

## Quick Start

1. Ensure you have access to:
   - Claude (3.5 Sonnet or higher)
   - Perplexity (Pro recommended)
   - ChatGPT (GPT-4)
   - Google Docs

2. Define your target market (required parameter)

   ```yaml
   target_market: "US smart home security market"
   ```

3. Follow the workflow:
   1. Generate research queries with Claude
   2. Set up Google Doc with proper formatting
   3. Execute research in Perplexity
   4. Synthesize findings with ChatGPT

## Time & Tools

- **Time to Execute**: 15-20 minutes
- **Tools Required**: 4 (Claude, Perplexity, ChatGPT, Google Docs)

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| target_market | Yes | - | The specific market to analyze |
| time_horizon | No | "3 years" | Future time period for projections |

## Workflow Steps

### 1. Query Generation (Claude)

Uses Claude to generate 5 focused research queries covering different aspects of the market:

- Market size and growth
- Competitive landscape
- Consumer trends
- Growth drivers
- Technology/innovation

### 2. Document Setup (Google Docs)

Creates a structured document for research collection:

- Name your google doc with a meaningful name. Consider using the following format: "[Date] - [Topic] - Market Analysis Research"
- Example: "2024-11-25 - Smart Home Security - Market Analysis Research"
- Proper formatting for queries and responses (H1 for queries, normal text for responses)

### 3. Research Execution (Perplexity)

Systematically gathers data for each query:

- Captures complete responses using the Copy button at the bottom of the response
- Maintains organized documentation

### 4. Analysis Synthesis (ChatGPT)

Generates comprehensive market analysis with:

- Executive Summary
- Market Overview
- Strategic Implications

## Output Structure

The final analysis includes:

```markdown
# Market Analysis Report
## 1. Executive Summary
- Market Size and Growth
- Key Drivers
- Major Trends

## 2. Market Overview
- Detailed Segmentation
- Growth Drivers
- Constraints

## 3. Strategic Implications
- Market Opportunities
- Entry Barriers
- Success Factors
```

## Best Practices

1. Query Generation
   - Review and refine queries before execution
   - Ensure coverage of all key market aspects

2. Document Organization
   - Double-check formatting after each paste
   - Add clear section breaks between queries
   - Maintain consistent heading hierarchy

3. Research Execution
   - Let Perplexity complete its response fully
   - Verify data point consistency

4. Analysis Synthesis
   - Review all data before synthesis
   - Ensure data points are properly referenced
   - Maintain logical flow in analysis

## Tool Requirements

### Claude

- Model: Claude 3.5 Sonnet
- Purpose: Query generation
- Key setting: None required

### Perplexity

- Focus: Web
- Pro account: Recommended
- Purpose: Research execution

### ChatGPT

- Model: GPT-4
- Purpose: Analysis synthesis
- Web search: Not required

### Google Docs

- Purpose: Research documentation
- Settings: Markdown support enabled

## Troubleshooting

Common issues and solutions:

1. **Formatting issues in Google Docs**
   - Make sure the style is set to "Normal text" before pasting.
   - Tools | Prefences | Enable Markdown
   - Edit | Past as Markdown

2. **Inconsistent data points**
   - Solution: Cross-reference across multiple queries
   - Prevention: Include date ranges in queries

## Recipe Variations

1. **Quick Analysis**
   - Reduce queries to 3 key aspects
   - Focus on high-level metrics
   - Use shorter time horizons

2. **Deep Dive**
   - Add competitor-specific queries
   - Include patent/technology analysis
   - Expand regional coverage

## Credits

## Support

For issues or suggestions:

1. Use GitHub Issues for bugs/feature requests
2. Use GitHub Discussions for usage questions
3. Check existing discussions before posting

## License

MIT License - Feel free to modify and reuse
