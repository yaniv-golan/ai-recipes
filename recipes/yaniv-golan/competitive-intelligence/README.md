# competitive-intelligence



A systematic approach to competitive intelligence that combines Claude's query generation, Perplexity's research capabilities, and ChatGPT's synthesis to create comprehensive competitive analysis reports.

## Workflow

```mermaid
---
title: Workflow
---
graph TD
    query_generation["Competitive Query Generation<br>(claude)"]
    query_generation -->|Copy queries for next step| setup_document
    setup_document["Research Document Setup<br>(google_docs)"]
    setup_document -->|Output| research_execution
    research_execution["Competitive Research Collection<br>(perplexity)"]
    research_execution -->|Save document as PDF when complete| competitive_assessment
    competitive_assessment["Competitive Analysis Generation<br>(chatgpt)"]

```

## Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|----------|
| company_name | Yes | Your company name for competitor analysis context | SimpliSafe |
| target_industry | Yes | The industry to analyze competitors in | US smart home security market |
| competitors | No | List of key competitors to focus on | ADT, Ring, Vivint |


## Tools Required

### claude

- Query generation
- Analysis framework development

**Settings:**

- model: Claude 3.5 Sonnet

### perplexity

- Competitor research execution
- Data gathering

**Settings:**

- focus: Web
- enable_pro: True

### chatgpt

- Data synthesis
- Report generation

**Settings:**

- model: GPT-4o
- enable_web_search: False

### google_docs

- Research documentation
- Report organization

**Settings:**

- enable_markdown: True



## Workflow Steps
### Competitive Query Generation

Generate focused competitor analysis queries

**Usage:**
1. Create a new conversation with Claude
2. Use the provided prompt template
3. Review and refine generated queries


**Note:** Ensure queries cover market share, product comparison, strategy, financial performance, and customer feedback

### Research Document Setup

Create and format Google Doc for competitor research

**Usage:**
1. Create new Google Doc
2. Set title format: "[Date] - [Industry] - Competitive Analysis"
   Example: "2024-11-25 - Smart Home Security - Competitive Analysis"
3. For each query from previous step:
   a. Paste query text
   b. Format as Heading 1
   c. Press Enter twice to leave space for response
   d. Ensure normal text formatting is set for response area


**Note:** Double-check formatting settings after each query addition

### Competitive Research Collection

Execute competitor research queries and document findings

**Usage:**
For each research query in the Google Doc:
1. Copy query text
2. Execute in Perplexity 
3. Wait for complete response
4. Click 'Copy' button in Perplexity response
5. Return to Google Doc
6. Paste response under corresponding query heading
7. Add blank line before next query section


### Competitive Analysis Generation

Synthesize research findings into comprehensive competitive assessment

**Usage:**
1. Upload research PDF to ChatGPT
2. Use the provided analysis prompt
3. Review output for completeness


**Note:** Ensure all competitor comparisons are objective and data-driven

## Tips

- Include specific competitor names in queries when possible
- Focus on recent data and developments
- Cross-reference competitive claims across multiple sources
- Look for objective metrics and comparisons
- Pay attention to pricing and feature comparisons

## Examples

### Example Usage

Parameters:
```yaml
company_name: SimpliSafe
target_industry: US smart home security market
competitors: ADT, Ring, Vivint
```

Sample Queries:
- What are the current market shares and revenue figures for ADT, SimpliSafe, and Ring in the US smart home security market as of 2024?
- Compare product offerings, pricing models, and subscription plans for leading US smart home security providers in 2024.

