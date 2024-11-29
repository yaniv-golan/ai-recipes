import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetadataForm } from '../components/MetadataForm';
import { ParametersForm } from '../components/ParametersForm';
import { WorkflowStepsForm } from '../components/WorkflowStepsForm';
import { TipsAndExamplesForm } from '../components/TipsAndExamplesForm';
import { PreviewForm } from '../components/PreviewForm';
import { Parameter, WorkflowStep, Example } from '../types/workflow';
import { ToolSettings } from '../components/ToolsForm';

type Step = 'metadata' | 'parameters' | 'workflow' | 'tips' | 'preview';

export function WorkflowCreator() {
    const [currentStep, setCurrentStep] = useState<Step>('metadata');
    const [formData, setFormData] = useState({
        metadata: {
            name: '',
            description: '',
            tags: [] as string[],
        },
        parameters: [] as Parameter[],
        tools: {
            chatgpt: {
                used_for: [] as string[],
                settings: {
                    model: 'GPT-4o' as const,
                    enable_web_search: false,
                    custom_gpt: null,
                }
            },
            claude: {
                used_for: [] as string[],
                settings: {
                    model: 'Claude 3.5 Sonnet' as const,
                    enable_artifacts: false,
                    enable_analysis_tool: false,
                }
            },
            perplexity: {
                used_for: [] as string[],
                settings: {
                    focus: 'Web' as const,
                    enable_pro: false
                }
            },
            google_docs: {
                used_for: [] as string[],
                settings: {
                    enable_markdown: true
                }
            },
        } satisfies ToolSettings,
        workflow: [] as WorkflowStep[],
        tips: [] as string[],
        examples: [] as Example[],
    });

    const navigate = useNavigate();

    const steps: Step[] = ['metadata', 'parameters', 'workflow', 'tips', 'preview'];

    const handleNext = () => {
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1]);
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
            navigate('/');
        }
    };

    const handleMetadataChange = (metadata: typeof formData.metadata) => {
        setFormData(prev => ({ ...prev, metadata }));
    };

    const handleParametersChange = (parameters: Parameter[]) => {
        setFormData(prev => ({ ...prev, parameters }));
    };

    const handleWorkflowChange = (workflow: WorkflowStep[]) => {
        setFormData(prev => ({ ...prev, workflow }));
    };

    const handleTipsChange = (tips: string[]) => {
        setFormData(prev => ({ ...prev, tips }));
    };

    const handleExamplesChange = (examples: Example[]) => {
        setFormData(prev => ({ ...prev, examples }));
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 'metadata':
                return (
                    formData.metadata.name.trim() !== '' &&
                    formData.metadata.description.trim() !== '' &&
                    formData.metadata.tags.length > 0
                );
            case 'parameters':
                return formData.parameters.every(param =>
                    param.name.trim() !== '' &&
                    param.description.trim() !== ''
                );
            case 'workflow':
                return formData.workflow.length > 0 && formData.workflow.every(step =>
                    step.tool_usage.trim() !== ''
                );
            case 'tips':
                return formData.tips.length > 0;
            default:
                return true;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Workflow</h1>

            {/* Progress indicator */}
            <div className="mb-8">
                <div className="flex justify-between">
                    {steps.map((step) => (
                        <div
                            key={step}
                            className={`flex-1 text-center ${steps.indexOf(step) < steps.indexOf(currentStep)
                                ? 'text-blue-600'
                                : step === currentStep
                                    ? 'text-blue-800 font-bold'
                                    : 'text-gray-400'
                                }`}
                        >
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                        </div>
                    ))}
                </div>
                <div className="relative mt-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="h-1 w-full bg-gray-200 rounded"></div>
                    </div>
                    <div className="relative flex justify-between">
                        {steps.map((step) => (
                            <div
                                key={step}
                                className={`w-6 h-6 rounded-full ${steps.indexOf(step) < steps.indexOf(currentStep)
                                    ? 'bg-blue-600'
                                    : step === currentStep
                                        ? 'bg-blue-800'
                                        : 'bg-gray-200'
                                    } flex items-center justify-center`}
                            >
                                <div className={`w-2 h-2 rounded-full ${steps.indexOf(step) <= steps.indexOf(currentStep)
                                    ? 'bg-white'
                                    : 'bg-gray-400'
                                    }`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form content */}
            <div className="bg-white shadow rounded-lg p-6 mb-8">
                {currentStep === 'metadata' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                        <MetadataForm
                            data={formData.metadata}
                            onChange={handleMetadataChange}
                        />
                    </div>
                )}
                {currentStep === 'parameters' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Parameters</h2>
                        <ParametersForm
                            parameters={formData.parameters}
                            onChange={handleParametersChange}
                        />
                    </div>
                )}
                {currentStep === 'workflow' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Workflow Steps</h2>
                        <WorkflowStepsForm
                            steps={formData.workflow}
                            onChange={handleWorkflowChange}
                        />
                    </div>
                )}
                {currentStep === 'tips' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Tips & Examples</h2>
                        <TipsAndExamplesForm
                            tips={formData.tips}
                            examples={formData.examples}
                            parameters={formData.parameters}
                            onTipsChange={handleTipsChange}
                            onExamplesChange={handleExamplesChange}
                        />
                    </div>
                )}
                {currentStep === 'preview' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Preview & Submit</h2>
                        <PreviewForm data={formData} />
                    </div>
                )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
                <div className="space-x-4">
                    {currentStep !== steps[0] && (
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Back
                        </button>
                    )}
                    {currentStep !== 'preview' && (
                        <button
                            onClick={handleNext}
                            disabled={!isStepValid()}
                            className={`px-4 py-2 rounded ${isStepValid()
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 