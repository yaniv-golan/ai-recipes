# Contributing to AI Recipes

Thank you for your interest in contributing to AI Recipes! This guide will help you understand how to contribute effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Recipe Guidelines](#recipe-guidelines)
- [Application Development](#application-development)
- [Pull Request Process](#pull-request-process)
- [Development Setup](#development-setup)
- [Recipe Submission Options](#recipe-submission-options)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)

## Ways to Contribute

1. **Submit New Recipes** (No Coding Required!)
   - Create useful workflow recipes
   - Share innovative tool combinations
   - Document real-world use cases
   - Focus on consumer/prosumer tools

2. **Improve Documentation**
   - Fix typos and errors
   - Add missing information
   - Clarify confusing sections
   - Translate content

3. **Enhance the Application** (For Developers)
   - Add new features
   - Fix bugs
   - Improve UI/UX
   - Optimize performance

4. **Review Pull Requests**
   - Test proposed changes
   - Provide constructive feedback
   - Help maintain quality

## Recipe Guidelines

When submitting recipes:

1. **Structure**
   - Follow the [Recipe Description Guidelines](recipe-description.md)
   - Use the [Tool Usage Guidelines](tool-usage.md)
   - Apply the [Prompt Writing Guidelines](prompt-writing.md)

2. **Quality**
   - Test thoroughly with actual tools
   - Include clear, step-by-step instructions
   - Document parameters
   - Add helpful examples

3. **Best Practices**
   - Use meaningful names
   - Write clear instructions
   - Consider edge cases
   - Focus on user interfaces, not APIs

## Application Development

The AI Recipes web application was built using:

- React + TypeScript for the frontend
- Node.js for recipe processing
- [Cursor](https://cursor.sh) v0.43.5 for development

Key areas for contribution:

1. **Frontend**
   - Recipe visualization
   - Parameter handling
   - Tool integration UI
   - Error handling

2. **Recipe Processing**
   - YAML validation
   - Documentation generation
   - Parameter processing
   - Error handling

3. **Documentation**
   - User guides
   - Recipe guidelines
   - Development guides
   - Example recipes

## Pull Request Process

1. **Before Starting**
   - Check existing issues/PRs
   - Discuss major changes
   - Read relevant guidelines

2. **Creating PRs**

   ```bash
   # Fork and clone the repository
   git clone https://github.com/your-username/ai-recipes.git
   cd ai-recipes

   # Create a branch
   # For recipes (no coding needed):
   git checkout -b recipe/your-recipe-name
   # For features (developers):
   git checkout -b feature/your-feature-name
   # For fixes (developers):
   git checkout -b fix/issue-description

   # Make changes and commit
   git add .
   git commit -m "Description of changes"

   # Push changes
   git push origin your-branch-name
   ```

3. **PR Requirements**
   - Clear description
   - Link related issues
   - Pass all checks
   - Follow guidelines
   - Update documentation

4. **Review Process**
   - Address feedback
   - Keep changes focused
   - Be responsive
   - Be patient

## Development Setup (For Application Contributors)

1. **Environment Setup**

   ```bash
   # Install dependencies
   npm install

   # Set up pre-commit hooks
   npm run prepare
   ```

2. **Running Tests**

   ```bash
   # Run all tests
   npm test

   # Run specific tests
   npm test -- recipes/your-recipe
   ```

3. **Code Style**
   - Use ESLint
   - Follow Prettier config
   - Maintain consistency

4. **Documentation**
   - Update relevant docs
   - Add JSDoc comments
   - Include examples

## Recipe Submission Options

There are two ways to submit recipes:

1. **Manual Submission (Recommended for Most Users)**
   - Create your recipe files locally
   - Download the YAML file from the recipe editor
   - Create a pull request manually on GitHub
   - No sign-in required

2. **Direct Submission (Coming Soon)**
   - Use the web interface to create recipes
   - Sign in with GitHub
   - Submit directly from the browser
   - Currently under development

Note: The "Sign in with GitHub" feature is currently unavailable as we set up proper OAuth credentials. Please use the manual submission process for now.

## Getting Help

- Ask in [GitHub Discussions](https://github.com/yaniv-golan/ai-recipes/discussions)
- Check [FAQ](faq.md)
- Read [Troubleshooting](troubleshooting.md)
- Browse [Example Recipes](examples.md)
