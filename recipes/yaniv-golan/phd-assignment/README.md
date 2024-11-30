# PhD Assignment



Process multiple PDFs for academic research by summarizing with Claude, collecting in Google Docs, and generating final answer with ChatGPT

## Workflow

```mermaid
---
title: Workflow
---
graph TD
    summarize_pdfs["Summarize PDFs<br>({'id': 'claude', 'name': 'Claude AI Assistant', 'description': "Anthropic's Claude AI model for text analysis and generation", 'iconUrl': './tools/claude/icon.svg', 'settings': {'enable_artifacts': True}})"]
    summarize_pdfs -->|Output| collect_summaries
    collect_summaries["Collect Summaries<br>({'id': 'google_docs', 'name': 'Google Docs', 'description': "Google's collaborative document editing platform", 'iconUrl': './tools/google_docs/icon.webp', 'settings': {'enable_markdown': True}})"]
    collect_summaries -->|Output| generate_answer
    generate_answer["Generate Answer<br>({'id': 'chatgpt', 'name': 'ChatGPT', 'description': "OpenAI's GPT models for conversational AI and text generation", 'iconUrl': './tools/chatgpt/icon.svg', 'settings': {'enable_web_search': False}})"]

```

## Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|----------|
| pdf_files | No | List of PDF files to process | paper1.pdf, paper2.pdf, paper3.pdf |
| research_question | No | The research question to be answered | What are the main applications and challenges of deep learning in medical imaging? |
| summary_prompt | No | Custom prompt for summarizing PDFs (optional) |  |


## Tools Required

### chatgpt


### claude


### google_docs




## Workflow Steps
### 1. Summarize PDFs

Use Claude to generate comprehensive summaries of academic papers

**Usage:**
1. For each PDF file:
   a. Upload the PDF to Claude
   b. Use the summary prompt (default or custom)
   c. Save the generated summary


**Output:** Save summaries for use in the next step (2. Collect Summaries)

### 2. Collect Summaries

Organize paper summaries in a Google Doc

**Input:** Paper summaries from the previous step (1. Summarize PDFs)

**Usage:**
1. Create a new Google Doc titled "Research Summaries - [Date]"
2. Add all PDF summaries from the previous step (1. Summarize PDFs) with clear section headers
3. Format for readability


**Output:** Save document for use in the next step (3. Generate Answer)

### 3. Generate Answer

Generate comprehensive answer to research question

**Input:** Research summaries from the previous step (2. Collect Summaries)

**Usage:**
1. Upload the Google Doc with summaries from the previous step (2. Collect Summaries)
2. Use the analysis prompt to generate answer
3. Review and refine the response


## Tips

- Use consistent section headers in Google Docs to make the summaries easy to navigate
- Consider adding tags or keywords to each summary for better organization
- If the PDFs are large, you may want to focus Claude's summary on specific sections
- Make sure to include page numbers or section references in the summaries for easy verification

## Examples

### Example Usage

Parameters:
```yaml
research_question: What are the main applications and challenges of deep learning in medical imaging?
pdf_files: paper1.pdf, paper2.pdf, paper3.pdf
```

Sample Queries:
- Summarize the methodology and findings from the papers regarding deep learning applications in medical imaging
- What are the common challenges and limitations identified across the papers?

