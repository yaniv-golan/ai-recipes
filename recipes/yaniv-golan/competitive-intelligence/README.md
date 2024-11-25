# Competitive Intelligence Recipe

> "I use this process every time I need to understand competitive movements in our market." - Michael

A systematic approach to competitive intelligence that combines multiple AI tools to efficiently gather and analyze competitor information. This recipe uses Claude for query generation, Perplexity for research, and ChatGPT for synthesis to create comprehensive competitive analysis reports.

## Quick Start

1. Ensure you have access to:
   - Claude (3.5 Sonnet or higher)
   - Perplexity (Pro recommended)
   - ChatGPT (GPT-4)
   - Google Docs

2. Define your parameters:

   ```yaml
   company_name: "SimpliSafe"              # Your company
   target_industry: "Smart home security"   # Your industry
   competitors: "ADT, Ring, Vivint"        # Key competitors
   ```

3. Follow the workflow:
   1. Generate competitor research queries with Claude
   2. Set up Google Doc with proper formatting
   3. Execute research in Perplexity
   4. Synthesize competitive assessment with ChatGPT

## Time & Difficulty

- **Time to Execute**: 15-20 minutes
- **Difficulty Level**: Intermediate
- **Tools Required**: 4 (Claude, Perplexity, ChatGPT, Google Docs)

## Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|----------|
| company_name | Yes | Your company's name | "SimpliSafe" |
| target_industry | Yes | Industry to analyze | "US smart home security market" |
| competitors | No | Key competitors to focus on | "ADT, Ring, Vivint" |

## Workflow Steps

### 1. Query Generation (Claude)

Generates 5 focused competitor analysis queries covering:

- Market share and revenue comparison
- Product and pricing analysis
- Marketing strategies
- Financial performance
- Customer feedback and satisfaction

### 2. Document Setup (Google Docs)

Creates structured document for competitive research:

- Title format: "[Date] - [Industry] - Competitive Analysis"
- Example: "2024-11-25 - Smart Home Security - Competitive Analysis"
- Organized sections for each competitor aspect

### 3. Research Execution (Perplexity)

Systematically gathers competitor data:

- Uses Academic focus for reliable sources
- Documents competitive insights
- Maintains structured data collection

### 4. Competitive Assessment (ChatGPT)

Generates comprehensive analysis covering:

- Competitive Landscape
- Strategic Analysis
- Competitive Dynamics

## Output Structure

The final assessment includes:

```markdown
# Competitive Assessment Report

## 1. Competitive Landscape
- Market Share Analysis
- Positioning Comparison
- Key Player Profiles

## 2. Strategic Analysis
- Product/Service Comparison
- Pricing Strategies
- Go-to-Market Approaches

## 3. Competitive Dynamics
- Key Differentiators
- Strengths/Weaknesses
- Strategic Moves
```

## Best Practices

1. Query Generation
   - Include specific competitor names
   - Focus on current data
   - Cover multiple competitive aspects
   - Be specific about metrics

2. Research Collection
   - Verify data from multiple sources
   - Note dates of information
   - Document contradictions
   - Track methodology and sources

3. Analysis
   - Stay objective
   - Use specific data points
   - Note information gaps
   - Consider market context

4. Report Creation
   - Use consistent competitor naming
   - Include source citations
   - Highlight key insights
   - Note limitations

## Tool Requirements

### Claude

- Model: Claude 3.5 Sonnet
- Purpose: Competitor query generation
- Key setting: None required

### Perplexity

- Pro account: Recommended
- Purpose: Competitor research

### ChatGPT

- Model: GPT-4
- Purpose: Competitive assessment
- Web search: Not required

### Google Docs

- Purpose: Research documentation
- Settings: Markdown support enabled

## Troubleshooting

Common issues and solutions:

1. **Outdated Competitor Data**
   - Solution: Add date ranges to queries
   - Alternative: Cross-reference multiple sources

2. **Inconsistent Metrics**
   - Solution: Standardize metrics before comparison
   - Prevention: Define key metrics in queries

3. **Missing Private Company Data**
   - Solution: Use industry estimates
   - Alternative: Focus on observable metrics

## Recipe Variations

1. **Quick Assessment**
   - Focus on top 2-3 competitors
   - Use key metrics only
   - Streamline analysis sections

2. **Deep Dive**
   - Add product feature matrix
   - Include customer sentiment analysis
   - Track historical changes

3. **Strategic Focus**
   - Emphasize go-to-market strategies
   - Focus on differentiation
   - Analyze future positioning

## Competitive Intelligence Ethics

1. Use only publicly available information
2. Verify sources and data points
3. Maintain objectivity in analysis
4. Respect confidential information
5. Follow industry research guidelines

## Support

For issues or suggestions:

1. Use GitHub Issues for bugs/feature requests
2. Use GitHub Discussions for usage questions
3. Check existing discussions before posting

## License

MIT License - Feel free to modify and reuse
