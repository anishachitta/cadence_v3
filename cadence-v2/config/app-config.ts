// Application configuration
export const appConfig = {
  // Enable real calls in all environments
  useRealCalls: true,

  // Default caller ID for Retell calls (must be a verified number in your Retell account)
  defaultCallerId: "+12136569648", // Updated to use your verified number

  // Retell Agent ID
  retellAgentId: "agent_ff9f1f45cbebc6233f1c7c2cff", // Your agent ID

  // Demo mode settings (only used as fallback if API calls fail)
  demoMode: {
    // Simulate call durations (in milliseconds)
    dialingDuration: 2000,
    connectingDuration: 3000,
    callDuration: 15000,

    // Simulate call success rate (0-1)
    successRate: 0.9,
  },
}
