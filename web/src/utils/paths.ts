/**
 * Utility functions for handling paths in the application
 */

// Get base URL from environment variable or default to /ai-recipes/
const BASE_URL = import.meta.env.VITE_BASE_URL || '/ai-recipes/';

/**
 * Joins path segments and ensures proper formatting
 * @param segments Path segments to join
 * @returns Properly formatted path
 */
export function joinPaths(...segments: string[]): string {
    return segments
        .map(segment => segment.replace(/^\/+|\/+$/g, ''))
        .filter(Boolean)
        .join('/');
}

/**
 * Creates a full URL path with the base URL
 * @param path Path relative to base URL
 * @returns Full URL path
 */
export function getFullPath(path: string): string {
    return `${BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;
}

/**
 * Gets the path to a tool's icon
 * @param toolId Tool identifier
 * @param iconFileName Icon file name from tool config
 * @returns Full path to tool icon
 */
export function getToolIconPath(toolId: string, iconFileName: string): string {
    return getFullPath(joinPaths('data/tools', toolId, iconFileName));
}

/**
 * Gets the path to a tool's schema
 * @param toolId Tool identifier
 * @returns Full path to tool schema
 */
export function getToolSchemaPath(toolId: string): string {
    return getFullPath(joinPaths('data/schemas', `${toolId}.json`));
}

/**
 * Gets the path to the recipes data file
 * @returns Full path to recipes.json
 */
export function getRecipesDataPath(): string {
    return getFullPath('data/recipes.json');
}

/**
 * Gets the default icon path for tools
 * @returns Full path to default tool icon
 */
export function getDefaultIconPath(): string {
    return getFullPath('data/tools/default-icon.svg');
} 