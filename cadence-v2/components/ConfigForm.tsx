"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import type { RetellConfig } from "@/types"
import { toast } from "sonner"

interface ConfigFormProps {
  onConfigSaved: (config: RetellConfig) => boolean
  validationError?: string | null
}

const ConfigForm = ({ onConfigSaved, validationError }: ConfigFormProps) => {
  const [apiKey, setApiKey] = useState("")
  const [fromNumber, setFromNumber] = useState("")
  const [agentId, setAgentId] = useState("")
  const [error, setError] = useState<string | null>(validationError || null)

  // Load any existing values from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("retellConfig")
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setApiKey(parsed.apiKey || "")
        setFromNumber(parsed.fromNumber || "")
        setAgentId(parsed.agentId || "")
      } catch (error) {
        console.error("Error parsing saved config in form:", error)
      }
    }
  }, [])

  // Update error when validationError prop changes
  useEffect(() => {
    setError(validationError || null)
  }, [validationError])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Format phone number if needed
    let formattedNumber = fromNumber
    if (formattedNumber && !formattedNumber.startsWith("+")) {
      formattedNumber = `+${formattedNumber.replace(/\D/g, "")}`
    }

    const success = onConfigSaved({
      apiKey,
      fromNumber: formattedNumber,
      agentId,
    })

    if (success) {
      toast.success("Configuration saved successfully")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Retell API Configuration</CardTitle>
        <CardDescription>Enter your Retell API credentials to start making calls</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="key_xxxxxxxxxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromNumber">From Phone Number</Label>
            <Input
              id="fromNumber"
              type="text"
              placeholder="+15551234567"
              value={fromNumber}
              onChange={(e) => setFromNumber(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">Must be in E.164 format (e.g., +15551234567)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agentId">Agent ID</Label>
            <Input
              id="agentId"
              type="text"
              placeholder="agent_xxxxxxxxxx"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">{error}</div>}

          <Button type="submit" className="w-full">
            Save Configuration
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        <p>You can find these values in your Retell dashboard.</p>
      </CardFooter>
    </Card>
  )
}

export default ConfigForm
