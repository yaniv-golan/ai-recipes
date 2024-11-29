import React from 'react';
import { Tool, ToolSettings } from '../types/workflow';
import { TOOL_CONFIGS, ToolConfig } from '../utils/tools';

type ToolsFormProps = {
    tool: Tool;
    onChange: (tool: Tool) => void;
};

export function ToolsForm({ tool, onChange }: ToolsFormProps) {
    const toolConfig = TOOL_CONFIGS[tool.id];

    if (!toolConfig) {
        return null;
    }

    const handleSettingAdd = (setting: string) => {
        const updatedTool = {
            ...tool,
            settings: {
                ...tool.settings,
                [setting]: null // Start with "doesn't matter"
            }
        };
        onChange(updatedTool);
    };

    const handleSettingRemove = (setting: keyof ToolSettings) => {
        const { [setting]: _, ...remainingSettings } = tool.settings;
        const updatedTool = {
            ...tool,
            settings: remainingSettings
        };
        onChange(updatedTool);
    };

    const handleSettingChange = (setting: keyof ToolSettings, value: boolean | null | string) => {
        const updatedTool = {
            ...tool,
            settings: {
                ...tool.settings,
                [setting]: value
            }
        };
        onChange(updatedTool);
    };

    // Only show settings that are valid for this tool
    const validSettings = Object.entries(tool.settings)
        .filter(([key]) => key in (toolConfig.availableSettings || {}));

    // Get unused settings
    const unusedSettings = Object.entries(toolConfig.availableSettings || {})
        .filter(([key]) => !(key in tool.settings));

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tool Configuration</h3>

                {/* Model Selection */}
                {toolConfig.models && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                        <select
                            value={tool.model || ''}
                            onChange={(e) => onChange({ ...tool, model: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">Select a model</option>
                            {toolConfig.models.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Active Settings */}
                {validSettings.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Active Settings</h4>
                        <div className="space-y-4">
                            {validSettings.map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {toolConfig.availableSettings?.[key]}
                                        </label>
                                        {key === 'focus' ? (
                                            <select
                                                value={value as string}
                                                onChange={(e) => handleSettingChange(key as keyof ToolSettings, e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            >
                                                <option value="Web">Web</option>
                                                <option value="Academic">Academic</option>
                                                <option value="Math">Math</option>
                                                <option value="Writing">Writing</option>
                                                <option value="Video">Video</option>
                                                <option value="Social">Social</option>
                                            </select>
                                        ) : (
                                            <select
                                                value={value === null ? 'null' : value.toString()}
                                                onChange={(e) => {
                                                    const val = e.target.value === 'null' ? null : e.target.value === 'true';
                                                    handleSettingChange(key as keyof ToolSettings, val);
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            >
                                                <option value="null">Doesn't matter</option>
                                                <option value="true">Required</option>
                                                <option value="false">Disabled</option>
                                            </select>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleSettingRemove(key as keyof ToolSettings)}
                                        className="ml-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <span className="sr-only">Remove setting</span>
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add Setting Dropdown */}
                {unusedSettings.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Add Setting</label>
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    handleSettingAdd(e.target.value);
                                    e.target.value = ''; // Reset select
                                }
                            }}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value=""
                        >
                            <option value="">Select a setting to add...</option>
                            {unusedSettings.map(([key, description]) => (
                                <option key={key} value={key}>{description}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
} 