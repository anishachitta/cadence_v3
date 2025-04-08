/**
 * Utility to detect if we're running in a preview environment
 */
export function isPreviewEnvironment(): boolean {
  // Always return false to enable real calls in all environments
  return false
}

/**
 * Determine if real calls should be used based on environment and config
 */
export function shouldUseRealCalls(configValue: boolean): boolean {
  // Always return true to enable real calls
  return true
}
