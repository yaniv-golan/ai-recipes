import { WorkflowStep } from '../types/workflow';

export const STEP_REF_REGEX = /#([a-z0-9_]+)/g;

export function validateStepReferences(text: string, steps: WorkflowStep[]) {
    const matches = text.matchAll(STEP_REF_REGEX);
    const invalidRefs: string[] = [];
    let isValid = true;

    for (const match of matches) {
        const stepId = match[1];
        if (!steps.some(step => step.id === stepId)) {
            invalidRefs.push(stepId);
            isValid = false;
        }
    }

    return { isValid, invalidRefs };
}

export function highlightStepReferences(text: string, steps: WorkflowStep[]) {
    return text.replace(STEP_REF_REGEX, (match, stepId) => {
        const isValid = steps.some(step => step.id === stepId);
        return `<span class="${isValid ? 'text-blue-600' : 'text-red-600'}">${match}</span>`;
    });
} 