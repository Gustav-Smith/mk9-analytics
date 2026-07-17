# Prompt Library - MK9 Analytics

## Overview
This document contains a collection of useful prompts for interacting with AI assistants when working on the MK9 Analytics project. These prompts are designed to help with common development tasks, debugging, and understanding the codebase.

## Project Understanding Prompts

### Project Overview
```
Explain the overall purpose and objectives of the MK9 Analytics project.
```

### Architecture Explanation
```
Describe the architectural layers of MK9 Analytics and how they interact.
```

### Module Explanation
```
What is the responsibility of the [MODULE_NAME] module and how does it interact with other modules?
```

### Data Flow Explanation
```
Explain the data flow for the [FEATURE_NAME] feature from user input to data persistence.
```

## Development Task Prompts

### Creating a New API Endpoint
```
I need to create a new API endpoint for [ENTITY] that supports [OPERATIONS]. 
Please provide the code structure following the existing patterns in src/app/api/.
```

### Creating a New Module
```
I need to create a new module called [MODULE_NAME] for [PURPOSE]. 
Please provide the folder structure and essential files following the module structure guidelines.
```

### Adding a Database Field
```
I need to add a new field [FIELD_NAME] of type [TYPE] to the [ENTITY] entity.
Please show the changes needed in prisma/schema.prisma and any related considerations.
```

### Creating a React Component
```
I need to create a reusable [COMPONENT_TYPE] component for the [MODULE] module.
Please provide the component code following the existing UI patterns and styling conventions.
```

### Creating a Service Method
```
I need to create a service method in [MODULE] that [DESCRIPTION OF FUNCTIONALITY].
Please provide the service code following the existing patterns, including proper error handling.
```

### Creating a Validation Schema
```
I need to create a Zod validation schema for [ENTITY/OBJECT] that validates [FIELD_RULES].
Please provide the schema code following the existing validation patterns.
```

## Debugging and Troubleshooting Prompts

### Debugging a Bug
```
I'm encountering an issue where [DESCRIPTION OF PROBLEM]. 
The error occurs in [FILE/LOCATION] when [CONDITIONS]. 
What are the possible causes and how should I approach debugging this?
```

### Performance Issue
```
I'm noticing performance issues with [FEATURE/COMPONENT]. 
What are the common performance bottlenecks in this area and how can I optimize it?
```

### Database Query Optimization
```
I have a Prisma query that is performing poorly: [QUERY CODE].
How can I optimize this query for better performance?
```

### Error Resolution
```
I'm getting this error: [ERROR MESSAGE]
It occurs when [CONDITIONS]. 
What does this error mean and how can I fix it?
```

## Refactoring and Improvement Prompts

### Code Refactoring
```
This code in [FILE] feels repetitive and hard to maintain: [CODE SNIPPET].
How can I refactor it to follow DRY principles and improve readability?
```

### Improving Test Coverage
```
I need to write tests for [FUNCTION/COMPONENT/MODULE]. 
What are the key test cases I should cover and what testing approach should I use?
```

### Adding Features
```
I want to add [FEATURE DESCRIPTION] to the [MODULE] module.
What files would I need to modify and what is the recommended implementation approach?
```

## Architecture and Design Prompts

### Design Pattern Application
```
How would you apply the [DESIGN_PATTERN] pattern in the context of [MODULE/FEATURE] in MK9 Analytics?
```

### Technology Choice Justification
```
Why was [TECHNOLOGY/APPROACH] chosen for [ASPECT] of MK9 Analytics?
Are there alternative approaches that were considered?
```

### Extensibility Questions
```
How would I extend the [SYSTEM/COMPONENT] to support [NEW_FEATURE] without modifying existing code?
```

## Specific Task Prompts

### Authentication Related
```
How should I implement authentication middleware for protecting API routes in MK9 Analytics?
What are the best practices for session management in this Next.js application?
```

### Import Processing Related
```
What is the recommended approach for parsing large Excel files in the imports module 
without causing memory issues?
```

### Dashboard Related
```
How should I implement real-time updates for the dashboard 
without causing excessive re-renders or API calls?
```

### Testing Related
```
What is the recommended approach for testing database-dependent services 
in MK9 Analytics without hitting the actual database?
```

## Code Review Prompts

### Code Quality Review
```
Please review this code snippet for adherence to MK9 Analytics coding standards: [CODE SNIPPET]
```

### Security Review
```
Are there any security concerns in this implementation: [CODE SNIPPET]?
```

### Performance Review
```
Could this code have performance implications: [CODE SNIPPET]?
If so, how would you optimize it?
```

## Learning and Onboarding Prompts

### Onboarding New Developers
```
What are the first 5 things a new developer should do when starting work on MK9 Analytics?
```

### Learning Specific Areas
```
I want to understand how the import processing works in MK9 Analytics.
Can you walk me through the flow from file upload to data persistence?
```

### Best Practices
```
What are the top 3 best practices for working with Prisma in MK9 Analytics?
```

## Template Prompts

### Feature Request Template
```
Feature: [FEATURE_NAME]
Description: [DETAILED DESCRIPTION]
Modules Affected: [LIST OF MODULES]
Dependencies: [LIST OF DEPENDENCIES]
Acceptance Criteria:
- [CRITERION 1]
- [CRITERION 2]
- [CRITERION 3]
Technical Considerations:
- [CONSIDERATION 1]
- [CONSIDERATION 2]
```

### Bug Report Template
```
Bug: [BUG_DESCRIPTION]
Steps to Reproduce:
1. [STEP 1]
2. [STEP 2]
3. [STEP 3]
Expected Behavior: [EXPECTED_BEHAVIOR]
Actual Behavior: [ACTUAL_BEHAVIOR]
Environment: [ENVIRONMENT_DETAILS]
```

### Technical Documentation Template
```
# [TOPIC_NAME]

## Overview
[DESCRIPTION]

## Details
[DETAILED_EXPLANATION]

## Implementation
[IMPLEMENTATION_DETAILS]

## Considerations
[IMPORTANT_CONSIDERATIONS]

## Examples
[CODE_EXAMPLES_OR_USAGE_EXAMPLES]
```

## Usage Guidelines

### How to Use These Prompts
1. **Be Specific**: Replace bracketed placeholders with specific details about your task
2. **Context Matters**: Provide relevant file paths, error messages, or code snippets when asking for help
3. **Iterate**: Use the responses as starting points and refine based on the specific situation
4. **Verify**: Always check that AI-generated code follows project conventions and passes tests

### When to Ask for Help
- When starting a new feature or module
- When encountering unfamiliar error messages
- When optimizing performance-critical code
- When implementing security-sensitive functionality
- When refactoring complex legacy code

### When to Trust Your Judgment
- When the AI suggestion doesn't match project patterns
- When the suggested solution overcomplicates a simple problem
- When security or data integrity is at stake
- When the solution doesn't address the root cause of an issue

## Maintenance

### Keeping This Document Updated
- Add new prompts as you discover common tasks
- Remove outdated prompts as the project evolves
- Update examples to match current code patterns
- Add project-specific patterns as they emerge

### Contributing to the Prompt Library
- Share useful prompts you've created or found helpful
- Categorize new prompts appropriately
- Provide examples that reflect real project scenarios
- Keep prompts concise but comprehensive

-- 
*Last updated: July 16, 2026*