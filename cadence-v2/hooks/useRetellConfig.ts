"use client"

import { useState, useEffect } from "react"
import type { RetellConfig } from "@/types"

export function useRetellConfig() {
  const [config, setConfig] = useState<RetellConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    // Load config from localStorage on mount
    const savedConfig = localStorage.getItem("retellConfig")
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig)
        setConfig(parsedConfig)
      } catch (error) {
        console.error("Error parsing saved config:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const validateConfig = (newConfig: RetellConfig): string | null => {
    if (!newConfig.apiKey || !newConfig.apiKey.trim()) {
      return "API Key is required"
    }

    if (!newConfig.fromNumber || !newConfig.fromNumber.trim()) {
      return "From Phone Number is required"
    }

    // Basic E.164 format validation for fromNumber
    if (!newConfig.fromNumber.startsWith("+")) {
      return "From Phone Number must be in E.164 format (starting with +)"
    }

    if (!newConfig.agentId || !newConfig.agentId.trim()) {
      return "Agent ID is required"
    }

    return null
  }

  const saveConfig = (newConfig: RetellConfig) => {
    // Validate config before saving
    const error = validateConfig(newConfig)
    if (error) {
      setValidationError(error)
      return false
    }

    // Save to localStorage and update state
    localStorage.setItem("retellConfig", JSON.stringify(newConfig))
    setConfig(newConfig)
    setValidationError(null)
    return true
  }

  const resetConfig = () => {
    // Clear from localStorage and reset state
    localStorage.removeItem("retellConfig")
    setConfig(null)
    setValidationError(null)
  }

  return {
    config,
    isLoading,
    validationError,
    saveConfig,
    resetConfig,
    hasConfig: !!config,
  }
}
